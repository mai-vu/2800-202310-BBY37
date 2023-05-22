require("../utils.js");
require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
    try {
        if (!req.session.authenticated) {
            res.redirect('/?error=' + encodeURIComponent('You must be logged in to view this page. Sign up or log in now'));
            return;
        }
        res.render("webcam");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

async function getLabelsFromImage(imageFile) {
    try {
        // Imports the Google Cloud client library
        const vision = require('@google-cloud/vision');

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Define the label hints for food ingredients
        const labelHints = [
            {description: 'cooking ingredient'},
            // {
            //     description: 'meat'
            // },
            // {
            //     description: 'poultry'
            // },
            // {
            //     description: 'fish'
            // },
            // {
            //     description: 'seafood'
            // },
            // {
            //     description: 'egg'
            // },
            // {
            //     description: 'dairy'
            // },
            // {
            //     description: 'cheese'
            // },
            // {
            //     description: 'milk'
            // },
            // {
            //     description: 'yogurt'
            // },
            // {
            //     description: 'tofu'
            // },
            // {
            //     description: 'beans'
            // },
            // {
            //     description: 'legumes'
            // },
            // {
            //     description: 'nuts'
            // },
            // {
            //     description: 'seeds'
            // },
            // {
            //     description: 'grains'
            // },
            // {
            //     description: 'bread'
            // },
            // {
            //     description: 'pasta'
            // },
            // {
            //     description: 'rice'
            // },
            // {
            //     description: 'vegetable'
            // },
            // {
            //     description: 'fruit'
            // },
            // {
            //     description: 'herb'
            // },
            // {
            //     description: 'spice'
            // },
            // {
            //     description: 'oil'
            // },

            // Add more relevant food ingredient labels or keywords as needed
        ];

        // Perform label detection with label hints on the image file
        const [result] = await client.labelDetection(imageFile.buffer, {
            labelHints: labelHints,
        });

        const labels = result.labelAnnotations;

        // Extract the label descriptions
        const labelDescriptions = labels.map((label) => label.description);

        return labelDescriptions;
    } catch (error) {
        console.error('Error in getLabelsFromImage:', error);
        throw new Error('Failed to process image.');
    }
}

router.post('/getLabels', upload.single('imageFile'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                error: 'No image file provided.'
            });
            return;
        }

        const imageFile = req.file;

        // Call the function to get labels from the image using Google Cloud Vision API
        const labels = await getLabelsFromImage(imageFile);

        console.log('Labels:' + labels);

        res.json({
            labels
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;