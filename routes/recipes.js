// Import required modules and dependencies
require("../utils.js"); // Assuming this is a custom utility module
require('dotenv').config(); // Load environment variables from .env file
const express = require('express') // Import express module
const router = express.Router() // Create a router object

//database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');

// Get the users and recipes collection
const userCollection = database.db(mongodb_database).collection('users');
const recipeCollection = database.db(mongodb_database).collection('recipes');

// Helper function to sort recipes
function sortRecipes(recipes, sortOption) {
  if (sortOption === 'asc') {
    // Sort the recipes by minutes in ascending order
    return recipes.sort((a, b) => a.minutes - b.minutes);
  } else if (sortOption === 'desc') {
    // Sort the recipes by minutes in descending order
    return recipes.sort((a, b) => b.minutes - a.minutes);
  } else if (sortOption === 'numIngredients') {
    // Sort the recipes by number of ingredients in ascending order
    return recipes.sort((a, b) => a.ingredients.length - b.ingredients.length);
  }
  // Default sorting option if none of the above conditions match
  return recipes;
}

//Generate recipes based on ingredients list
router.post('/', async (req, res) => {
    try {
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }

        // Retrieve the ignoreDietaryRestrictions value from the request body
        const ignoreDietaryRestrictions = (req.body.ignoreDietaryRestrictions === 'true');

        // Retrieve the ingredients from the request body
        const ingredients = JSON.parse(req.body.ingredients);

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
                //sort by number of matches
                $sort: {
                    numMatches: -1
                }
            },
            {
                $limit: 10000
            },
            {   
                //randomly select 20 recipes from the top 10000
                $sample: {
                    size: 20
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

            // Sort the recipes based on the sort option using the helper function
            const sortOption = req.body.sort;
            const sortedRecipes = sortRecipes(recipesWithSavedStatus, sortOption);

            const ingredientsJSON = JSON.stringify(ingredients);

            // Render the recipes page (recipes.ejs) with the matching recipes and the user's dietary restrictions based on sort option
            res.render("recipes", {
                email: req.session.email,
                name: req.session.name,
                dietaryRestrictions: req.session.dietaryRestrictions,
                ingredients: ingredientsJSON,
                sort: sortOption,
                ignoreDietaryRestrictions: ignoreDietaryRestrictions,
                recipes: sortedRecipes,
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

//View saved recipes
router.get('/myRecipes', async (req, res) => {
    try {
        // Redirect to home page if user is not logged in
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }

        // Retrieve the ignoreDietaryRestrictions value from the request query
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

        // Sort the recipes based on the sort option using the helper function
        const sortOption = req.query.sort;
        const sortedRecipes = sortRecipes(savedRecipes, sortOption);

        // Render the recipes page (recipes.ejs) with the saved recipes and the user's dietary restrictions based on sort option
        res.render('recipes', {
            recipes: sortedRecipes,
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