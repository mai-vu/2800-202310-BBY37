require("../utils.js");
require('dotenv').config();
const express = require('express')
const router = express.Router()
const fs = require('fs');
// OpenAI API 
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


//function to make prompt
function makePrompt(ingredients) {
    let prompt = `Use this follow array ingredients ` + ingredients + ` , and return a parsonable JSON string in the following format: 
    [
        {
            "name": name of waste,
            "expired" concise useful recommendations of uses for expired food,
            "aboutToExpire" concise useful recommendations of uses for food about to expire,
        }
    ]
    `
    console.log("the made prompt is ", prompt);
    return prompt;

}

//async function to get content from OpenAi API
//function to for openai completion without test page
async function sendPrompt(testPrompt) {
    const response = await openai.createCompletion({
        model : "text-davinci-003",
        prompt : testPrompt,
        max_tokens : 2000,
        temperature : 0.9,
    });
    const chatString = response.data.choices[0].text;
    return chatString;
};



//Generate recipes based on ingredients list
router.post('/', async (req, res) => {
   let ingredients = req.session.ingredients;
   console.log(ingredients);
   
//    let chatString = await sendPrompt(makePrompt(ingredients));
//    let chatJSON = JSON.parse(chatString);
//        res.render('wasteReductionCards', {
//          wastes : chatJSON
//    });
});

module.exports = router