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
        console.log("Added " + ingredients);
    }
    res.redirect('/home/');
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

//Generate recipes based on ingredients list
router.post('/recipes', async (req, res) => {
    try {  
        console.log(ingredients);
      // Search for recipes that contain at least one of the ingredients  
      const recipes = await recipeCollection
        .aggregate([
          {
            $match: { ingredients: { $in: ingredients } }
          },
          {
            $addFields: {
              matchedIngredients: { $setIntersection: [ingredients, "$ingredients"] }
            }
          },
          {
            $addFields: {
              numMatches: { $size: "$matchedIngredients" }
            }
          },
          {
            $sort: { numMatches: -1 }
          },
          {
            // Only return the top 40 recipes
            $limit: 40
          }
        ])
        .toArray();
    
      // Render the recipes page (recipes.ejs) with the matching recipes  
      res.render("recipes", {
        name: req.session.name,
        dietaryRestrictions: req.session.dietaryRestrictions,
        ingredients: ingredients,
        recipes: recipes
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get('/recipes/:recipeName', async (req, res) => {
    try {
      // Retrieve the recipe name from the request parameters
      const recipeName = req.params.recipeName;
  
      // Query the database or retrieve the recipe details based on the recipe name
      const recipeDetails = await recipeCollection.findOne({ name: recipeName });

      // Render the recipe details page (recipe.ejs) with the matching recipe
      res.render('recipe', {
        recipe: recipeDetails,
      });
    } catch (err) {
      // Handle error
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
module.exports = router