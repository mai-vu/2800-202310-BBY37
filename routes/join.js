// Import required modules and dependencies
require("../utils.js"); // Assuming this is a custom utility module
require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require('bcrypt'); // Import bcrypt module for password hashing
const Joi = require("joi"); // Import Joi module for input validation
const saltRounds = 12; // Number of salt rounds for bcrypt
const fs = require('fs'); // Import fs module for reading JSON file
const express = require('express') // Import express module
const router = express.Router() // Create a router object
const expireTime = 60 * 60 * 1000; // expires in 1 hour (in milliseconds)

// read and parse the JSON file
const allRestrictions = JSON.parse(fs.readFileSync('public/dietaryRestrictions.json'));

//database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');
const userCollection = database.db(mongodb_database).collection('users');

// Define a route for the sign up page
router.get('/signup', (req, res) => {
    // Get the error message from the query string
    const error = req.query.error;

    // Render the sign up page
    res.render('signup', {
        dietaryRestrictions: allRestrictions,
        error: error
    });
});

// Define a route for the sign up form's action
router.post('/submit', async (req, res) => {
    try {
        // Get the user's information from the request body
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var dietaryRestrictions = req.body.dietaryRestrictions;

        //Check if dietaryRestrictions is an array, if not, make it an array
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
            res.redirect('/join/signup?error=' + encodeURIComponent(`Please provide a ${key}.Try again')`));
            return;
        }

        // Check if the email is already in use
        const user = await userCollection.findOne({
            email: email
        });
        if (user) {
            res.redirect('/join/signup?error=' + encodeURIComponent(`Email already in use, please try again`));
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

// Define a route for the login page
router.get('/login', (req, res) => {
    // Get the error message from the query string
    const error = req.query.error;

    // Render the login page
    res.render('login', {
        error: error
    });
});

// Define a route for the login form's action
router.post('/loggingin', async (req, res) => {
    // Get the user's information from the request body
    var email = req.body.email;
    var password = req.body.password;

    // Validate the user input using Joi
    const schema = Joi.string().max(20).required();
    const validationResult = schema.validate(email);
    if (validationResult.error) {
        const errorMessage = `Please enter both fields to log in.<br> <a href="/join/login">Try again</a>`;
        res.render('login', {
            error: errorMessage
        });
        return;
    }

    // Check if the user exists
    const result = await userCollection.find({
        email: email
    }).project({
        email: 1,
        name: 1,
        password: 1,
        dietaryRestrictions: 1,
        _id: 1
    }).toArray();

    // If the user does not exist, redirect to the login page
    if (result.length != 1) {
        console.log("user not found");
        res.render('login');
        return;
    }

    // Check if the password is correct
    if (await bcrypt.compare(password, result[0].password)) {
        req.session.authenticated = true;
        req.session.name = result[0].name;
        req.session.email = result[0].email;
        req.session.password = result[0].password;
        req.session.dietaryRestrictions = result[0].dietaryRestrictions;
        req.session.cookie.maxAge = expireTime;

        // Redirect the user to the home page
        res.redirect('/home');
        return;
    } else {
        console.log("incorrect password");
        res.redirect('/join/login?error=' + encodeURIComponent(`Invalid email/password combination. Try again`));
        return;
    }
});

// Define a route for the logout action
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router