// fuzzysearch.js

require("../utils.js");
const express = require('express');
require('dotenv').config();
const router = express.Router();
const fs = require('fs');
const mongodb_database = process.env.MONGODB_DATABASE;
var {
    database
} = include('database');


const ingredientsCollection = database.db(mongodb_database).collection('ingredients');

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

        const docs = await ingredientsCollection.aggregate(query).limit(10).toArray();
        const topTen = docs.map(doc => doc.name);
        res.json(topTen);
    } catch (err) {
        console.error('Error fetching ingredients:', err);
        res.status(500).send('Error fetching ingredients');
    }
});

module.exports = router;  
