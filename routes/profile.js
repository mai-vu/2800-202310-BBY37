require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 12;
const fs = require('fs');

// read and parse the JSON file
const allRestrictions = JSON.parse(fs.readFileSync('public/dietaryRestrictions.json'));

//database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');
const userCollection = database.db(mongodb_database).collection('users');

//Route to profile page
router.get('/', (req, res) => {
    var name = req.session.name;
    var email = req.session.email;
    var password = req.session.password;
    var restrictions = req.session.dietaryRestrictions;
    if (!req.session.authenticated) {
        res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
        return;
    }
    res.render("profile", {
        email: email,
        name: name,
        password: password,
        dietaryRestrictions: restrictions
    });
});

//Route to edit profile page
router.get('/editProfile', (req, res) => {
    var name = req.session.name;
    var email = req.session.email;
    var password = req.session.password;
    var restrictions = req.session.dietaryRestrictions;
    if (!req.session.authenticated) {
        res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
        return;
    }
    res.render("editProfile", {
        email: email,
        name: name,
        password: password,
        dietaryRestrictions: restrictions,
        allRestrictions: allRestrictions,
        error: undefined
    });
});

//Define a route for the edit profile form's action
router.post('/updateProfile', async (req, res) => {
    const email = req.session.email;
    var {
        name,
        currentPassword,
        newPassword,
        confirmPassword,
        dietaryRestrictions
    } = req.body;

    // Validate the user input using Joi
    const Joi = require('joi');

    const schema = Joi.object({
        name: Joi.string().max(25).required(),
        newPassword: Joi.string().max(20).allow('')
    });

    const validationResult = schema.validate({
        name,
        newPassword: newPassword
    });

    if (validationResult.error) {
        const {
            context: {
                key
            }
        } = validationResult.error.details[0];
        const errorMessage = `Please provide a ${key}.<br> <a href="/profile/editProfile">Try again</a>`;
        res.send(errorMessage);
        return;
    }

    if (!Array.isArray(dietaryRestrictions)) {
        dietaryRestrictions = [dietaryRestrictions];
    }

    // Retrieve the current user from the database
    const user = await userCollection.findOne({
        email
    });

    // Check if the current password is correct
    const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrectPassword) {
        return res.render('editProfile', {
            error: 'Current password is incorrect.',
            email,
            name,
            password: user.password,
            dietaryRestrictions: user.dietaryRestrictions,
            allRestrictions
        });
    }

    // Update the user's information
    const updates = {
        $set: {
            name,
            email,
            dietaryRestrictions
        }
    };

    // Check if the user wants to update their password
    if (newPassword && confirmPassword) {
        // Check if the new password matches the confirmed password
        if (newPassword !== confirmPassword) {
            return res.render('editProfile', {
                error: 'Passwords do not match.',
                email,
                name,
                password: user.password,
                dietaryRestrictions: user.dietaryRestrictions,
                allRestrictions
            });
        }

        // Hash the new password and add it to the updates object
        var hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        updates.$set.password = hashedPassword;
    }

    // Update the user in the database
    await userCollection.updateOne({
        email
    }, updates);

    // Update the session with the new user information
    req.session.name = name;
    req.session.password = hashedPassword;
    req.session.dietaryRestrictions = dietaryRestrictions;

    res.redirect('/profile/');
});

module.exports = router