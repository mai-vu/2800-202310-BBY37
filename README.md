# Welcome to Entréepreneur!
#### Our team, BBY 37, is developing Entréepreneur, a personalized meal planning app, to help individuals reduce food waste and simplify their cooking experience with sustainable recipes tailored to their existing inventory.
## Technologies used
1. Javascript
2. HTML/EJS
3. CSS
4. ExpressJS
5. NodeJS
6. ChatGPT API
7. SendGrid API
8. Database: MongoDB

## File Contents
    Listing of File Contents of folder
    .
    ├──   .gitignore
    ├──   database.js
    ├──   index.js
    ├──   package.json
    ├──   Procfile
    ├──   README.md
    ├──   utils.js
    ├──   .vscode
    │   └──   settings.json 
    │
    ├──   public
    |   │   └──   dietaryRestrictions.json
    │   ├──   css
    |   │   └──   styles.css
    │   ├──   files_font
    |   │   ├──   comfortaa.ttf
    |   │   ├──   comfortaaBold.ttf
    |   │   ├──   mcItalic.otf
    |   │   ├──   mcReg.otf
    |   │   ├──   ostrichSans.otf
    |   │   ├──   ostrichSansBlack.otf
    |   │   └──   virgo.ttf
    │   ├──   img
    |   │   ├──   404.gif
    |   │   ├──   ai_bg.jpg
    |   │   ├──   entreePreneurIconOnly.png
    |   │   ├──   entreePreneurLogo.png
    |   │   ├──   food_bg.jpg
    |   │   ├──   mushroomBlock.png
    |   │   ├──   sus_stew.png
    |   │   └──   wooden_planks2.jpg
    |   |       
    |   └──   scripts
    |       ├──   editProfile.js
    |       ├──   footer.js
    |       ├──   home.js
    |       ├──   index.js
    |       ├──   recipes.js
    |       └──   topTen.js
    |           
    └──   routes
    |   ├──   fuzzySearch.js
    |   ├──   home.js
    |   ├──   join.js
    |   ├──   password.js
    |   ├──   profile.js
    |   ├──   recipes.js
    |   └──   reduceMyWaste.js
    |           
    └──   views
        ├──   404.ejs
        ├──   editProfile.ejs
        ├──   emailSent.ejs
        ├──   forgot-password.ejs
        ├──   home.ejs
        ├──   index.ejs
        ├──   login.ejs
        ├──   profile.ejs
        ├──   recipe.ejs
        ├──   recipes.ejs
        ├──   reduceMyWaste.ejs
        ├──   reset-password.ejs
        ├──   resetPasswordTemplate.ejs
        ├──   signup.ejs
        ├──   wasteReductionCards.ejs
        └──   templates
            ├──   easterEgg.ejs
            ├──   footer.ejs
            ├──   header.ejs
            ├──   ingredients.ejs
            ├──   recipes-card.ejs
            └──   wasteCard.ejs
 
 ## Instructions

1. Installation Requirements:
   - Language: JavaScript (Node.js)
   - IDEs: Any preferred code editor or IDE (e.g., Visual Studio Code, Atom)
   - Database: MongoDB (Make sure it is installed and running)

2. 3rd Party APIs and Frameworks:
   - Install the required dependencies by running the command: `npm install` in the project directory. The dependencies include:
      - @sendgrid/mail
      - bcrypt
      - connect-mongo
      - dotenv
      - ejs
      - express
      - express-session
      - fs
      - Joi
      - MongoDB

3. API Keys:
   - OpenAI Key: Obtain an API key from OpenAI and store it in the appropriate environment variable or configuration file.

4. Installation Order and Location:
   - Install Node.js and MongoDB according to their respective official documentation.
   - Clone the project repository from [https://github.com/mai-vu/2800-202310-BBY37.git].
   - Navigate to the project directory.
   - Run the command `npm install` to install the required dependencies.

5. Configuration:
   - Create a `.env` file in the root directory of the project.
   - Add the required environment variables in the `.env` file, such as the database connection URL and OpenAI API key.
   - Refer to the `.env.example` file provided in the project for the required environment variables.

## How to use the product (Features)***

## Credits
Contributors        Github              
- Mai Vu,           mai-vu
- Tomasz Stojek,    TomaszStojek
- Samuel Chua,      Crite-Spranberries
- Haurence Li,      qowier

Guides and Videos:

"CodeDeepDive: [https://www.youtube.com/watch?v=_gQITRGs4y0&ab_channel=CodeDeepDive]
SendGrid API Documentation: [https://docs.sendgrid.com/for-developers/sending-email/api-getting-started]
Google Cloud Vision API Documentation: [https://cloud.google.com/vision/docs]
MongoDB Atlas Search Documentation: [https://www.mongodb.com/docs/atlas/atlas-search/text/]
Studio3T: [https://www.youtube.com/watch?v=yZsKlxJcReE&ab_channel=Studio3T]
Acknowledgment:

ChatGPT: A special acknowledgment goes to ChatGPT for providing valuable assistance throughout the project. [https://chat.openai.com/]

## References 

Dataset:

Dataset from Kaggle: [https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions]
Citation: "Generating Personalized Recipes from Historical User Preferences" by Bodhisattwa Prasad Majumder, Shuyang Li, Jianmo Ni, Julian McAuley. EMNLP, 2019. [Link to the paper]

Image Content Credits:

Minecraft:
mushroomBlock: [https://www.deviantart.com/iwithered/art/1080p-Minecraft-Mushroom-Wallpaper-403102898]
sus_stew: [https://qph.cf2.quoracdn.net/main-qimg-cc299f2127fbf00e184546f2f99f28dd-lq]
wooden_planks2: [http://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/2c6a08e6e3929a6.png]
background and theme images generated with OpenAi [https://openai.com/product/dall-e-2]


## Licenses 

Copyright (c) 2023 Tomasz Stojek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Entreepreneur), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## AI Usages
    1. Did you use AI to help create your app? If so, how? Be specific.
    We used AI to assist in troubleshooting and fixing syntactical errors in JavaScript code. 
    We learned a lot about refactoring and writing more effective code through the examples provided by ChatGPT.

    2. Did you use AI to create datasets or clean datasets? If so, how? Be specific.
    We did not utilize AI to generate or modify datasets.

    3. Does your app use AI? If so, how? Be specific.
    We integrated the ChatGPT API to generate suggestions for utilizing commonly discarded food items. 
    While we initially sought existing recipe datasets for leftover or perishable foods, we ultimately opted 
    for ChatGPT as it enables us to offer accessible instructions with well-phrased guidance on the spot.

    4. Did you encounter any limitations? What were they, and how did you overcome them? Be specific.
    Initially, our food waste feature, which relied on ChatGPT's responses, lacked consistency and presented 
    a significant obstacle. We overcame this challenge through persistent trial and error, 
    persevering until we achieved the desired results.

## Contact Info
For any and all inquiries to our team BBY-37, or about our app Entréepreneur, please reach out below at the following email addresses.
- Mai Vu,  hvu28@my.bcit.ca
- Tomasz Stojek, tstojek@my.bcit.ca
- Samuel Chua, schua15@my.bcit.ca
- Haurence Li, hli223@my.bcit.ca

#### Shoutout: 
Special thanks to guidance provided by Instructors at BCIT, especailly Carly, and Patrick.
