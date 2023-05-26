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
 
 ## Instructions***
 How to install or run the project
    
    <aside>
    💡 **The main point here is to tell the new developer how to use the GitHub repo to begin working on your web app, including:**
    
    1. What does the developer need to install (don’t leave anything out!) like:
        1. language(s)
        2. IDEs
        3. Database(s)
        4. Other software
    2. Which 3rd party APIs and frameworks does the developer need to download?
    3. Do they need any API keys?
    4. In which order should they install things? Does installation location matter?
    5. Include detailed configuration instructions.
    6. Include a link to the testing plan you have completed so the new developer can see your testing history and maybe contribute to a minor bugfix!
    7. ***In a separate plaintext file called passwords.txt that has NOT been added to your repo, provide us with any admin/user/server login IDs and passwords. Don’t add this to your repo, especially if your repo is public! Upload this plaintext file to the 05d Dropbox in D2L.***
    </aside>
    
## How to use the product (Features)***

## Credits, References, and Licenses ***

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
