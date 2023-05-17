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


//Generate recipes based on ingredients list
router.post('/', async (req, res) => {
  try {
    const ingredients = JSON.parse(req.body.ingredients);
    console.log(ingredients);
    // Search for recipes that contain at least one of the ingredients  
    const recipes = await recipeCollection
      .aggregate([{
          $match: {
            ingredients: {
              $in: ingredients
            }
          }
        },
        {
          $addFields: {
            matchedIngredients: {
              $setIntersection: [ingredients, "$ingredients"]
            }
          }
        },
        {
          $addFields: {
            numMatches: {
              $size: "$matchedIngredients"
            }
          }
        },
        {
          $sort: {
            numMatches: -1
          }
        },
        {
          // Only return the top 40 recipes
          $limit: 40
        }
      ])
      .toArray();

    // Render the recipes page (recipes.ejs) with the matching recipes  
    res.render("recipes", {
      email: req.session.email,
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

router.get('/:recipeName', async (req, res) => {
  try {
    // Retrieve the recipe name from the request parameters
    const recipeName = req.params.recipeName;

    // Query the database or retrieve the recipe details based on the recipe name
    const recipeDetails = await recipeCollection.findOne({
      name: recipeName
    });

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