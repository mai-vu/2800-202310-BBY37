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
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }

        const ignoreDietaryRestrictions = (req.body.ignoreDietaryRestrictions === 'true');

        const ingredients = JSON.parse(req.body.ingredients);
        console.log(ingredients);
        // Search for recipes that contain at least one of the ingredients  
        const recipes = await recipeCollection.aggregate([{
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
                //Return only random 40 recipes that match the ingredients
                $sample: {
                    size: 40
                  }
            }
        ]).toArray();

        // Retrieve the user's email from the session
        const email = req.session.email;
        // Query the database for the user
        const user = await userCollection.findOne({
            email: email
        });

        if (user) {
            // Retrieve the user's saved recipes
            const savedRecipes = user.savedRecipes || [];

            // Add a property 'isSaved' to each recipe indicating if it is saved
            const recipesWithSavedStatus = recipes.map(recipe => {
                return {
                    ...recipe,
                    isSaved: savedRecipes.includes(recipe.id)
                };
            });

            // Sort the recipes based on the sort option
            const sortOption = req.body.sort;
            if (sortOption === 'asc') {
                recipesWithSavedStatus.sort((a, b) => a.minutes - b.minutes);
            } else if (sortOption === 'desc') {
                recipesWithSavedStatus.sort((a, b) => b.minutes - a.minutes);
            } else if (sortOption === 'numIngredients') {
                recipesWithSavedStatus.sort((a, b) => a.ingredients.length - b.ingredients.length);
            }

            const ingredientsJSON = JSON.stringify(ingredients);

            // Render the recipes page (recipes.ejs) with the matching recipes  
            res.render("recipes", {
                email: req.session.email,
                name: req.session.name,
                dietaryRestrictions: req.session.dietaryRestrictions,
                ingredients: ingredientsJSON,
                sort: sortOption,
                ignoreDietaryRestrictions: ignoreDietaryRestrictions,
                recipes: recipesWithSavedStatus, 
                isMyRecipesPage: false
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

router.get('/myRecipes', async (req, res) => {
    try {
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }

        const ignoreDietaryRestrictions = (req.query.ignoreDietaryRestrictions === 'true');

        // Get the user's saved recipe IDs from the user document
        const email = req.session.email;
        const user = await userCollection.findOne({
            email: email
        });

        //if user doesn't have any saved recipes, assign an empty array
        const savedRecipeIds = user.savedRecipes || [];
        
        // Retrieve the saved recipes from the recipe collection
        const savedRecipes = await recipeCollection.find({
            id: {
                $in: savedRecipeIds
            }
        }).toArray();
  

        // Add 'isSaved' property to each recipe
        savedRecipes.forEach(recipe => {
            recipe.isSaved = savedRecipeIds.includes(recipe.id.toString());
        });

        // Sort the recipes based on the sort option
        const sortOption = req.query.sort;
        if (sortOption === 'asc') {
            savedRecipes.sort((a, b) => a.minutes - b.minutes);
        } else if (sortOption === 'desc') {
            savedRecipes.sort((a, b) => b.minutes - a.minutes);
        } else if (sortOption === 'numIngredients') {
            savedRecipes.sort((a, b) => a.ingredients.length - b.ingredients.length);
        }

        res.render('recipes', {
            recipes: savedRecipes,
            dietaryRestrictions: req.session.dietaryRestrictions,
            ignoreDietaryRestrictions: ignoreDietaryRestrictions,
            sort: sortOption,
            isMyRecipesPage: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
});

//View recipe details
router.get('/:recipeName', async (req, res) => {
    try {
        // Retrieve the recipe name from the request parameters
        const recipeName = req.params.recipeName;

        // Query the database or retrieve the recipe details based on the recipe name
        const recipeDetails = await recipeCollection.findOne({
            name: recipeName
        });

        // Retrieve the user's email from the session
        const email = req.session.email;

        // Query the user collection to get the user's saved recipes
        const user = await userCollection.findOne({
            email: email
        });

        // Check if the user exists and retrieve the saved recipes
        if (user) {
            const savedRecipes = user.savedRecipes || [];

            // Add the 'isSaved' property to the recipe indicating if it is saved
            const isSaved = savedRecipes.includes(recipeDetails.id.toString());
            recipeDetails.isSaved = isSaved;
        }


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

// Save recipe function
router.post('/saveRecipe', async (req, res) => {
    try {
        // Retrieve the recipe id from the request body
        const recipeId = req.body.id;
        console.log(recipeId);
        // Retrieve the user's email from the session
        const email = req.session.email;
        // Query the database for the user
        const user = await userCollection.findOne({
            email: email
        });

        if (user) {
            // Retrieve the user's saved recipes or initialize as an empty array
            const savedRecipes = user.savedRecipes || [];
            // Check if the recipe is already saved
            const isSaved = savedRecipes.includes(recipeId);

            if (isSaved) {
                // If the recipe is already saved, remove it from the saved recipes
                const updatedRecipes = savedRecipes.filter((id) => id !== recipeId);
                await userCollection.updateOne({
                    email: email
                }, {
                    $set: {
                        savedRecipes: updatedRecipes
                    }
                });
                // Send a success response with saved status
                res.json({
                    saved: false
                });
            } else {
                // If the recipe is not already saved, add it to the saved recipes
                const updatedRecipes = [...savedRecipes, recipeId];
                await userCollection.updateOne({
                    email: email
                }, {
                    $set: {
                        savedRecipes: updatedRecipes
                    }
                });
                // Send a success response with saved status
                res.json({
                    saved: true
                });
            }
        } else {
            // Handle case when user is not found
            res.status(404).send('User not found');
        }
    } catch (err) {
        // Handle error
        console.error(err);
        res.status(500).redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
        return;
    }
});

module.exports = router