require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()
const fs = require('fs');


//test prompt
let testPrompt = "give me two things, 1 what do do with expires bananas and what do to do with it when its about to go bad";

//async function to get content from OpenAi API
//function to for openai completion without test page
async function sendPrompt(testPrompt) {
    const response = await openai.createCompletion({
        model : "text-davinci-003",
        prompt : testPrompt,
        max_tokens : 2000,
        temperature : 0.9,
    });
    const parsableJSON = response.data.choices[0].text;

    // const parsedJSON = JSON.parse(parsableJSON);

    console.log(parsableJSON);
    // console.log(parsedJSON);
    console.log(parsedJSON.recipes.length);
    return parsedJSON;
    
};



//Generate recipes based on ingredients list
router.post('/', async (req, res) => {
   let ingredients = req.session.ingredients;
   console.log(ingredients);
   for (let i = 0; i < ingredients.length; i++) {
       console.log(ingredients[i]);
   }
   let chatString = await sendPrompt(testPrompt);
   console.log(chatString);
   res.send(chatString);
   
});










module.exports = router