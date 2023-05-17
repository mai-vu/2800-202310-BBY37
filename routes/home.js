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
const recipeCollection = database.db(mongodb_database).collection('recipes');
const ingredients = [];

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
  var ingredient = req.body.ingredient.trim();
  if (ingredient !== "") {
    ingredients.push(ingredient);
  }
  res.render("home", {
    name: req.session.name,
    dietaryRestrictions: req.session.dietaryRestrictions,
    ingredients: ingredients,
  });
});

// Remove an ingredient from the list
router.post('/removeIngredient', (req, res) => {
  const index = req.body.index;
  if (index >= 0 && index < ingredients.length) {
    ingredients.splice(index, 1);
  }
  res.sendStatus(200);
});


//Clear ingredients list, then redirects /home
router.post('/clearIngredients', (req, res) => {
  ingredients.length = 0;
  console.log("Cleared all ingredients");
  res.redirect('/home/');
});

module.exports = router