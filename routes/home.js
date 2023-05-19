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

//testing clena up later ***********

//Route to home page
router.get('/', async (req, res) => {
  try {
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }
    ingredients.length = 0;
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: ingredients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/addIngredient', async (req, res) => {
  try {
    const ingredient = req.body.ingredient.trim();
    if (ingredient !== "") {
      ingredients.push(ingredient);
    }
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: ingredients,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Remove an ingredient from the list
router.post('/removeIngredient', async (req, res) => {
  const index = req.body.index;
  if (index >= 0 && index < ingredients.length) {
    ingredients.splice(index, 1);
  }
  res.render("home", {
    name: req.session.name,
    dietaryRestrictions: req.session.dietaryRestrictions,
    ingredients: ingredients,
  });
});

//Clear ingredients list, then redirects /home
router.post('/clearIngredients', (req, res) => {
  ingredients.length = 0;
  res.redirect('/home');
});

module.exports = router