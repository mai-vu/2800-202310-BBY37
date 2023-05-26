// Import required modules and dependencies
require("../utils.js"); // Assuming this is a custom utility module
require('dotenv').config(); // Load environment variables from .env file
const express = require('express') // Import express module
const router = express.Router() // Create a router object

//Route to home page
router.get('/', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }

    // Check if the user has any ingredients, if not, initialize the array
    if (!req.session.ingredients) {
      req.session.ingredients = [];
    }

    // Check if the user has any waste, if not, initialize the array
    if (!req.session.wasteList) {
      req.session.wasteList = [];
    }

    //if user is on reduceMyWaste page, render reduceMyWaste page
    if (!req.session.findRecipes || req.session.findRecipes === "false") {
      res.render("reduceMyWaste", {
        name: req.session.name,
        wasteList: req.session.wasteList,
      });

    //if user is on findRecipes home page, render findRecipes home page
    } else {
      res.render("home", {
        name: req.session.name,
        dietaryRestrictions: req.session.dietaryRestrictions,
        ingredients: req.session.ingredients
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Update req.session.findRecipes
router.post('/updateFindRecipes', (req, res) => {
  // Get the findRecipes from the request body
  const {
    findRecipes
  } = req.body;

  // Update req.session.findRecipes accordingly
  req.session.findRecipes = findRecipes;

  //check if there's sth in req.session.ingredients, push to req.session.wasteList
  if (req.session.ingredients.length > 0) {
    req.session.wasteList = req.session.wasteList.concat(req.session.ingredients);
    req.session.ingredients = [];
  }

  res.sendStatus(200);
});

//Add ingredient to list
router.post('/addIngredient', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }

    // Get the ingredient from the request body
    const ingredient = req.body.ingredient.trim();

    // Check if the ingredient is already in the list if input is not empty
    if (ingredient !== "") {

      // Check if the ingredient is already in the waste list if on reduceMyWaste page
      if (!req.session.findRecipes && !req.session.wasteList.includes(ingredient)) {
        // Add the ingredient to the waste list
        req.session.wasteList.push(ingredient);
        res.redirect("/home");

        // Check if the ingredient is already in the ingredients list if on home (find recipes) page
      } else if (req.session.findRecipes && !req.session.ingredients.includes(ingredient)) {
        // Add the ingredient to the ingredients list
        req.session.ingredients.push(ingredient);
        res.redirect("/home");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error. Please log in again.");
  }
});

//Remove ingredient from list
router.post('/removeIngredient', async (req, res) => {
  // Get the ingredient from the request body
  const ingredient = req.body.ingredient;

  // Remove the ingredient from the list
  const index = req.session.ingredients.indexOf(ingredient);
  if (!req.session.findRecipes) {
    req.session.wasteList.splice(index, 1);
  } else {
    req.session.ingredients.splice(index, 1);
  }

  // Rerender to the reducMyWaste page if previously on that page
  if (!req.session.findRecipes) {
    res.render("reduceMyWaste", {
      name: req.session.name,
      wasteList: req.session.wasteList
    });

  // Render to the home page if previously on home (find recipes) page
  } else {
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: req.session.ingredients
    });
  }
});


//Clear ingredients list, then redirects /home
router.post('/clearIngredients', (req, res) => {
  // Clear the ingredients list
  req.session.ingredients = [];

  // Render to the home page if on reduceMyWaste page
  if (!req.session.findRecipes || req.session.findRecipes === "false") {
    res.render("reduceMyWaste", {
      name: req.session.name,
      wasteList: req.session.wasteList
    });

  // Render to the home page if on home (find recipes) page
  } else {
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: req.session.ingredients
    });
  }
});

module.exports = router