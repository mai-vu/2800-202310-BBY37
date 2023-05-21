require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()
const fs = require('fs');



//database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');
const userCollection = database.db(mongodb_database).collection('users');

//Generate recipes based on ingredients list
router.post('/', async (req, res) => {
    try {
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }

        const ingredients = JSON.parse(req.body.ingredients);
        console.log(ingredients);

        // Retrieve the user's email from the session
        const email = req.session.email;
        // Query the database for the user
        const user = await userCollection.findOne({
            email: email
        });

        if (user) {

            const ingredientsJSON = JSON.stringify(ingredients);

            // Render the reduceMyWaste page (reduceMyWaste.ejs) with the matching information 
            res.render("reduceMyWaste", {
                email: req.session.email,
                name: req.session.name,
                ingredients: ingredientsJSON
            });
        } else {
            // Handle case when user is not found
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});







module.exports = router