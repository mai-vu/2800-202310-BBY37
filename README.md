# Welcome to Entréepreneur!
#### Our team, BBY 37, is developing Entréepreneur, a personalized meal planning app, to help individuals reduce food waste and simplify their cooking experience with sustainable recipes tailored to their existing inventory.
## Technologies used
- HTML/EJS, CSS, Javascript, ExpressJS/NodeJS
- APIs: ChatGPT API, SendGrid API
- CSS framework: BootStrap
- Database: MongoDB

## File Contents
    Listing of File Contents of folder
    .
    ├──   .gitignore                          # File specifying which files and directories should be ignored by Git.
    ├──   database.js                         # File containing code related to the database operations.
    ├──   index.js                            # Main entry point file for the application.
    ├──   package.json                        # File containing metadata and dependencies information for the project.
    ├──   Procfile                            # File used by Qoddi to specify the commands needed to run the application.
    ├──   README.md                           # File containing documentation and information about the project.
    ├──   utils.js                            # File containing utility functions for the application.
    ├──   .vscode
    │   └──   settings.json                   # Configuration file for Visual Studio Code with project-specific settings.
    │
    ├──   public
    |   │   └──   dietaryRestrictions.json    # jSon file to store dietary restrictions of users.
    │   ├──   css                             # Folder containing personalized CSS of our app.
    |   │   └──   styles.css
    │   ├──   files_font                      # Folder containing all fonts used in the app.
    |   │   ├──   comfortaa.ttf
    |   │   ├──   comfortaaBold.ttf
    |   │   ├──   mcItalic.otf
    |   │   ├──   mcReg.otf
    |   │   ├──   ostrichSans.otf
    |   │   ├──   ostrichSansBlack.otf
    |   │   └──   virgo.ttf
    │   ├──   img                             # Folder containing all images used in the app, including logo and easter eggs.
    |   │   ├──   404.gif
    |   │   ├──   ai_bg.jpg
    |   │   ├──   entreePreneurIconOnly.png
    |   │   ├──   entreePreneurLogo.png
    |   │   ├──   food_bg.jpg
    |   │   ├──   mushroomBlock.png
    |   │   ├──   sus_stew.png
    |   │   └──   wooden_planks2.jpg
    |   |       
    |   └──   scripts                         # Folder containing all scripts used in the app.
    |       ├──   editProfile.js              # Script for handling profile editing.
    |       ├──   footer.js                   # Script for handling footer logic.
    |       ├──   home.js                     # Script for handling app home logic.
    |       ├──   index.js                    # Script for handling log-in authentitcation.
    |       ├──   recipes.js                  # Script for handling recipe population.
    |       └──   topTen.js                   # Script for handling top ten recipe results.
    |           
    └──   routes                              # Express Routes for handling javascript.
    |   ├──   fuzzySearch.js                  # Script for handling fuzzy search.
    |   ├──   home.js                         # Script for handling logged in landing page.
    |   ├──   join.js                         # Script for handling signing up.
    |   ├──   password.js                     # Script for handling resetting passwords.
    |   ├──   profile.js                      # Script for handling profile rendering.
    |   ├──   recipes.js                      # Script for handling recipe sorting and searching.
    |   └──   reduceMyWaste.js                # Script for handling waste reduction page.
    |           
    └──   views                               # Folder for all HTML in EJS format.
        ├──   404.ejs                         # HTML for the 404 page.
        ├──   editProfile.ejs                 # HTML for the editProfile page.
        ├──   emailSent.ejs                   # HTML for the password reset confirmation.
        ├──   forgot-password.ejs             # HTML for the forgot password page.
        ├──   home.ejs                        # HTML for the home page.
        ├──   index.ejs                       # HTML for the main entry for app.
        ├──   login.ejs                       # HTML for the log in page.
        ├──   profile.ejs                     # HTML for the profile page.
        ├──   recipe.ejs                      # HTML for the recipe card.
        ├──   recipes.ejs                     # HTML for the recipes results page.
        ├──   reduceMyWaste.ejs               # HTML for the reduceWaste page.
        ├──   reset-password.ejs              # HTML for the password reset page.
        ├──   resetPasswordTemplate.ejs       # HTML for the password reset prompting page.
        ├──   signup.ejs                      # HTML for the sign up page.
        ├──   wasteReductionCards.ejs         # HTML for the reduceWaste card.
        └──   templates                       # Folder for reusable template HTML in EJS
            ├──   easterEgg.ejs               # HTML for the easter egg page.
            ├──   footer.ejs                  # HTML for the footer.
            ├──   header.ejs                  # HTML for the header.
            ├──   ingredients.ejs             # HTML for the ingredients.
            ├──   recipes-card.ejs            # HTML for the recipe card template.
            └──   wasteCard.ejs               # HTML for the reduceWaste card template.
 
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

6. Testing doc : [https://docs.google.com/spreadsheets/d/1D2_0nNGg7m1hTnAi-jS_qQN1x1nJDsQwbwI791cURqY/edit#gid=394496370]

## List of notable features:

    1: Sign-Up / Log-In
    To sign in to the application, the user must click on the sign-in button featured in the center card visible on the screen. If the user has made an account already, they can log-in through the log-in button.

    *Index > Sign-In*
    Alt:
    *Index > Log-In*

    2: Setting User Dietary Restrictions
    The user's dietary restrictions is provided upon signing in as a new user. This will affect how your meal planning generations will work later. The user can check off as much boxes necessary to fit their needs. This can be edited in the profiles card after logging in.

    *Index > Sign-in (Check off desired boxes)*
    Alt:
    *Home > Profile > Edit Profile (Check off desired boxes)*

    3: Forgot Password Reset
    If the user has logged in before but forgot their password, the app supports a reset password function. Underneath the log-in card is clickable text that allows the user to have a no-reply email sent to the typed in email that helps the user reset their password using a timed token.

    *Index > Log-In > Forgot Password Link > Forgot Password Email (Follow E-Mail Instructions)*

    **Section B: Main Functions**

    1: Ingredient waste reduction utilization prompt
    Shortly after the login user is instantly placed on the ingredient waste reduction page. User can then insert content in the addition bar, or choose the suggested fuzzy items.

    *Home (User Insert Prompts)*

    2: Meal generation prompt
    If the user wishes to make a meal out of ingredients, they can click on the generate meal button below the ingredient waste reduction page. This will bring them to the secondary meal recipe generation prompt.

    *Home > Meal Generation Page Button*

    3: Meal recipe page
    Upon making a meal in the meal generation prompt, the user is able to click on the green button which shows them to the recipe page. Here a user can click on the cards provided if they are interested, and can look at the single recipe card with the full ingredient descriptions.

    *Home > Meal Generation Page Button > Recipe generate Button > Recipe Card*

    4: Meal recipe favoriting
    Upon searching for a meal recipe, the user is greeted with cards that can be previewed with brief descriptions of their qualities. The user can favorite them both in preview form or in the recipe page by clicking on the card, then clicking on the blue star icon in the bottom right of the card.

    *Home > Meal Generation Page Button > Recipe generate Button > Recipe Card > Star Icon*

    5: Meal recipe sorting
    The user is able to sort ingredients in the meal generation recipe page. After a user has input their ingredients, recipes will show up. They will already be filtered with the user's dietary preferences, but they can also be sorted by ascending, descending, and least required ingredients, which is all visible after clicking on a white dropdown in the middle of the screen.

    *Home > Meal Generation Page Button > Recipe generate Button > Sort By Button*

    **Section C: Viewing Functions**

    1: Viewing Waste reduction/Meal generation prompt
    The user can click or remain on the home page which is indicated by a home icon to view both distinct prompts.

    *Home*

    2: Viewing Profile
    The user can click on the person icon to view all of their account information and dietary restrictions.

    *Home > Profile Icon*

    3: Viewing favorited recipes
    The user can click on the bookmark icon to view all saved recipes previously favorited.

    *Home > Bookmark Icon*

    4: Logout
    The user can click on the door icon to log out of the application.

    *Home > Door Exiting Icon*


    **Section D: Easter Egg**

    1: Suspicious Stew
    Upon entering the index page, go to the meal generations page and input: Cremini mushroom, Porcini mushroom, Bread bowl, Rose Petals.
    *Home > Meal Generation Page Button > Recipe generate Button > Input Ingredients Above*

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

### Shoutout: 
Special thanks to guidance provided by Instructors at BCIT, especailly Carly, and Patrick.
