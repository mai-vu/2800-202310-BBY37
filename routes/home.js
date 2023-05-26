require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()

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

    if (!req.session.wasteList) {
      req.session.wasteList = [];
    }

    if (!req.session.findRecipes || req.session.findRecipes === "false") {
      res.render("reduceMyWaste", {
        name: req.session.name,
        wasteList: req.session.wasteList,
      });
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
  const {
    findRecipes
  } = req.body;
  req.session.findRecipes = findRecipes;
  //check f there's sth in req.session.ingredients, push to req.session.wasteList
  if (req.session.ingredients.length > 0) {
    req.session.wasteList = req.session.wasteList.concat(req.session.ingredients);
    req.session.ingredients = [];
  }

  res.sendStatus(200);
});

router.post('/addIngredient', async (req, res) => {
  try {
    if (!req.session.authenticated) {
      res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
      return;
    }
    const ingredient = req.body.ingredient.trim();
    if (ingredient !== "") {
      if (!req.session.findRecipes && !req.session.wasteList.includes(ingredient)) {
        req.session.wasteList.push(ingredient);
        res.redirect("/home");
      } else if (req.session.findRecipes && !req.session.ingredients.includes(ingredient)) {
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
  const ingredient = req.body.ingredient;

  const index = req.session.ingredients.indexOf(ingredient);

  if (!req.session.findRecipes) {
    req.session.wasteList.splice(index, 1);
  } else {
    req.session.ingredients.splice(index, 1);
  }

  if (!req.session.findRecipes) {
    res.render("reduceMyWaste", {
      name: req.session.name,
      wasteList: req.session.wasteList
    });
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
  req.session.ingredients = [];
  if (!req.session.findRecipes || req.session.findRecipes === "false") {
    res.render("reduceMyWaste", {
      name: req.session.name,
      wasteList: req.session.wasteList
    });
  } else {
    res.render("home", {
      name: req.session.name,
      dietaryRestrictions: req.session.dietaryRestrictions,
      ingredients: req.session.ingredients
    });
  }
});

module.exports = router