require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const Joi = require("joi");
const saltRounds = 12;
const crypto = require('crypto');
const fs = require('fs');

// read and parse the JSON file
const allRestrictions = JSON.parse(fs.readFileSync('public/dietaryRestrictions.json'));

const app = express();
const port = process.env.PORT || 3000;

const expireTime = 60 * 60 * 1000; // expires in 1 hour (in milliseconds)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;  
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

/** For Routes */
const passwordRouter = require('./routes/password');
const profileRouter = require('./routes/profile');

/** For sending reset password email */
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var {
    database
} = include('database');

const userCollection = database.db(mongodb_database).collection('users');
let ingredients = [];

app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: false
}));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
    crypto: {
        secret: mongodb_session_secret
    }
})

app.use(express.json());

app.use(session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store 
    saveUninitialized: false,
    resave: true
}));

//Index page, gatekeeps if user is logged in
app.get('/', (req, res) => {
  if (!req.session.authenticated) {
    const error = req.query.error;
    res.render("index", { error: error });
  } else {
    res.redirect('/home');
  }
});

app.get('/home', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
        return;
      }
    res.render("home", {
        name: req.session.name,
        dietaryRestrictions: req.session.dietaryRestrictions,
        ingredients: ingredients,
    });
});

//Add ingredients to a list and prints on /home
app.post('/home', (req, res) => {
    const ingredient = req.body.ingredient.trim();
    if (ingredient !== "") {
        ingredients.push(ingredient);
        console.log("Added " + ingredients);
    }
    res.redirect('/home');
});

//Clear ingredients list, then redirects /home
app.post('/clearIngredients', (req, res) => {
    ingredients = [];
    console.log("Cleared all ingredients");
    res.redirect('/home');
});

// Define a route for the sign up page
app.get('/signup', (req, res) => {
    res.render('signup', {
        dietaryRestrictions: allRestrictions
    });
});

app.post('/submit', async (req, res) => {
    try {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var dietaryRestrictions = req.body.dietaryRestrictions;
        if (!Array.isArray(dietaryRestrictions)) {
            dietaryRestrictions = [dietaryRestrictions];
        }

        // Validate the user input using Joi
        const Joi = require('joi');

        const schema = Joi.object({
            name: Joi.string().max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().max(20).required()
        });

        const validationResult = schema.validate({
            name,
            email,
            password
        });
        if (validationResult.error) {
            const {
                context: {
                    key
                }
            } = validationResult.error.details[0];
            const errorMessage = `Please provide a ${key}.<br> <a href="/signup">Try again</a>`;
            res.send(errorMessage);
            return;
        }

        // Check if the email is already in use
        const user = await userCollection.findOne({
            email: email
        });
        if (user) {
            res.send(`The email address is already in use. <a href="/signup">Try again</a>`);
            return;
        }

        // Hash the password using bcrypt
        var hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the MongoDB database
        const newUser = {
            name,
            email,
            password: hashedPassword,
            dietaryRestrictions
        };
        const result = await userCollection.insertOne(newUser);

        // Set up a session for the new user
        req.session.authenticated = true;
        req.session.userId = result.insertedId;
        req.session.name = name;
        req.session.email = email;
        req.session.password = hashedPassword;
        req.session.dietaryRestrictions = dietaryRestrictions;


        // Redirect the user to the home page
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.send('An error occurred. Please try again later.');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/loggingin', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    const schema = Joi.string().max(20).required();
    const validationResult = schema.validate(email);
    if (validationResult.error != null) {
        console.log(validationResult.error);
        const errorMessage = `Please provide a ${key}.<br> <a href="/login">Try again</a>`;
        return res.send(errorMessage);
    }

    const result = await userCollection.find({
        email: email
    }).project({
        email: 1,
        name: 1,
        password: 1,
        dietaryRestrictions: 1,
        _id: 1
    }).toArray();

    console.log(result);
    if (result.length != 1) {
        console.log("user not found");
        res.render('login');
        return;
    }
    if (await bcrypt.compare(password, result[0].password)) {
        console.log("correct password");
        req.session.authenticated = true;
        req.session.name = result[0].name;
        req.session.email = result[0].email;
        req.session.password = result[0].password;
        req.session.dietaryRestrictions = result[0].dietaryRestrictions;
        req.session.cookie.maxAge = expireTime;

        res.redirect('/home');
        return;
    } else {
        console.log("incorrect password");
        const errorMessage = `Invalid email/password combination.<br><a href="/login">Try again</a>`;
        res.send(errorMessage);
        return;
    }
});

// Define a route for the profile related pages
app.use('/profile', profileRouter);
  
// Define a route for the password related pages
app.use('/password', passwordRouter);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
});