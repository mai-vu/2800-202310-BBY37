// Import required modules and dependencies
require("../utils.js"); // Assuming this is a custom utility module
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import express module
const router = express.Router(); // Create a router object

// Database connection
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');

// Get the ingredients collection
const ingredientsCollection = database.db(mongodb_database).collection('ingredients');

// Define a route for the fuzzy search
router.get('/', async (req, res) => {
    const testEntry = req.query.entry; // Access testEntry from the query parameters
    try {
        const query = [
            {
              $search: {
                index: "default",
                text: {
                  query: testEntry,  // use testEntry here
                  fuzzy: {},
                  path: {
                    wildcard: "*"
                  }
                }
              }
            }
        ];

        // Execute the query
        const docs = await ingredientsCollection.aggregate(query).limit(10).toArray();

        // Extract the top ten results
        const topTen = docs.map(doc => doc.name);

        // json() sends a JSON response composed of the specified data
        res.json(topTen);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).send('Error fetching ingredients');
    }
});

module.exports = router;  
