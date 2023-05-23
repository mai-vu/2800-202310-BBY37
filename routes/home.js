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
const vision_key = process.env.VISION_API_KEY;

//Route to home page
router.get('/', async (req, res) => {
  try {
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }
    
    if (!req.session.ingredients) {
      req.session.ingredients = [];
    }

    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: req.session.ingredients,
      vision_key: vision_key
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/addIngredient', async (req, res) => {
  try {
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }
    const ingredient = req.body.ingredient.trim();
    if (ingredient !== "") {
      // Check if the ingredient already exists in the array
      if (!req.session.ingredients.includes(ingredient)) {
        req.session.ingredients.push(ingredient);
      }
    }

    console.log("add " + req.session.ingredients);
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: req.session.ingredients
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error. Please log in again.");
  }
});

// Remove an ingredient from the list
router.post('/removeIngredient', async (req, res) => {
  const index = req.body.index;
  req.session.ingredients = req.session.ingredients.filter((_, i) => i !== index);

  console.log("list after remove " + req.session.ingredients);
  res.render("home", {
    name: req.session.name,
    dietaryRestrictions: req.session.dietaryRestrictions,
    ingredients: req.session.ingredients
  });
});

//Clear ingredients list, then redirects /home
router.post('/clearIngredients', (req, res) => {
  req.session.ingredients = [];
  res.redirect('/home');
});

module.exports = router