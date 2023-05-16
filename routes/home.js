require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()
const fs = require('fs');

// read and parse the JSON file
const allRestrictions = JSON.parse(fs.readFileSync('public/dietaryRestrictions.json'));

//database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');
const userCollection = database.db(mongodb_database).collection('users');
let ingredients = [];

//Route to home page
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
    const ingredient = req.body.ingredient.trim();
    if (ingredient !== "") {
        ingredients.push(ingredient);
        console.log("Added " + ingredients);
    }
    res.redirect('/home/');
});

//Clear ingredients list, then redirects /home
router.post('/clearIngredients', (req, res) => {
    ingredients = [];
    console.log("Cleared all ingredients");
    res.redirect('/home/');
});

module.exports = router