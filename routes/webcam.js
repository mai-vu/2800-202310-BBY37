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

async function getObjectsFromImage(imageFile) {
    try {
        // Imports the Google Cloud client library
        const vision = require('@google-cloud/vision');

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Perform label detection with label hints on the image file
        const [result] = await client.objectLocalization(imageFile.buffer);

        const objects = result.localizedObjectAnnotations;

        return objects;
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
        const objects = await getObjectsFromImage(imageFile);

        objects.forEach(object => console.log(object.name));

        res.json({
            objects: objects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;