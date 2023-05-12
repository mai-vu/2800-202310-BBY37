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
const dietaryRestrictions = JSON.parse(fs.readFileSync('public/dietaryRestrictions.json'));

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

/** For sending reset password email */
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var {
    database
} = include('database');

const userCollection = database.db(mongodb_database).collection('users');

const sendResetPasswordEmail = (email, resetLink) => {
    const msg = {
        to: email,
        from: 'noreply.entreepreneur@gmail.com',
        subject: 'Reset your password for Entreepreneur account',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
};


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

// Generate a random token
function generateToken() {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
}

app.use(express.json());


app.use(session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store 
    saveUninitialized: false,
    resave: true
}));

app.get('/', (req, res) => {
    if (!req.session.authenticated) {
        res.render("index");
        return;
    } else {
        res.render("home", {
            name: req.session.name,
            dietaryRestrictions: req.session.dietaryRestrictions
        });
        return;
    }
});


// Define a route for the sign up page
app.get('/signup', (req, res) => {
    res.render('signup', {
        dietaryRestrictions: dietaryRestrictions
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
        const hashedPassword = await bcrypt.hash(password, saltRounds);

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
        res.render("home", {
            name: req.session.name
        });
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

        res.render('home', {
            name: req.session.name
        });
        return;
    } else {
        console.log("incorrect password");
        const errorMessage = `Invalid email/password combination.<br><a href="/login">Try again</a>`;
        res.send(errorMessage);
        return;
    }
});

app.get('/profile', (req, res) => {
    var name = req.session.name;
    var email = req.session.email;
    var password = req.session.password;
    var restrictions = req.session.dietaryRestrictions;
    if (!req.session.authenticated) {
        res.render("index");
    }
    res.render("profile", {
        email: email,
        name: name,
        password: password,
        dietaryRestrictions: restrictions
    });
});

// app.get('/editProfile', (req, res) => {
//     var name = req.session.name;
//     var email = req.session.email;
//     var password = req.session.password;
//     var restrictions = req.session.dietaryRestrictions;
//     if (!req.session.authenticated) {
//         res.render("index");
//     }
//     res.render("editProfile", {email: email, name: name, password: password, dietaryRestrictions: restrictions, allRestrictions: dietaryRestrictions});
// });

app.get('/home', (req, res) => {
    if (!req.session.authenticated) {
        res.render("index");
    }

    res.render("home", {
        name: req.session.name
    });

});

// Route for rendering forgot password form
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// Route for handling password reset request
// Route for handling password reset request
app.post('/forgot-password', async (req, res) => {
    const {
        email
    } = req.body;

    const Joi = require('joi');

    // Validate email using Joi
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    const {error} = schema.validate({email});
    if (error) {
        return res.status(400).send('Invalid email');
    }

    try {
        // Check if user exists in the database
        const user = await userCollection.findOne({ email: email });
        console.log('Email: ' + email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log('User: ' + user.name);

        // Generate unique token and store it in the database along with user email and expiration time
        const resetToken = generateToken();
        const expirationTime = Date.now() + expireTime;
        console.log(resetToken);
        console.log(expirationTime);
        const result = await userCollection.updateOne({
            email: email
        }, {
            $set: {
                resetToken: resetToken,
                expirationTime: expirationTime
            }
        });
        
        // Send password reset email with reset token
        const resetLink = `https://entreepreneur.cyclic.app/reset-password?token=${resetToken}`;
        sendResetPasswordEmail(email, resetLink);
        console.log(resetLink);

        res.send('Password reset email sent');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
});


// Route for rendering password reset form
app.get('/reset-password', async (req, res) => {
    const { token } = req.query;

    try {
        // Check if token exists and hasn't expired
        const user = await userCollection.findOne({
            resetToken: token,
            expirationTime: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }

        res.render('reset-password', { token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Route for handling password reset
app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Check if token exists and hasn't expired
        const user = await userCollection.findOne({
            resetToken: token,
            expirationTime: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }

        // Hash new password and update in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userCollection.updateOne(
            { email: user.email },
            { $set: { password: hashedPassword } }
        );

        // Redirect to login page after password reset
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});



app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('index');
});

app.use(express.static(__dirname + "/public"));
app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
});