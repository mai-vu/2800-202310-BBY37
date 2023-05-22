require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;  
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

/** For Routes */
const passwordRouter = require('./routes/password');
const profileRouter = require('./routes/profile');
const joinRouter = require('./routes/join');
const homeRouter = require('./routes/home');
const recipesRouter = require('./routes/recipes');
const fuzzysearchRouter = require('./routes/fuzzySearch');
const webcamRouter = require('./routes/webcam');

app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: false
}));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
    crypto: {
        secret: mongodb_session_secret
    }
})

app.use(express.json());

app.use(session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store 
    saveUninitialized: false,
    resave: true
}));

//Index page, gatekeeps if user is logged in
app.get('/', (req, res) => {
  if (!req.session.authenticated) {
    const error = req.query.error;
    res.render("index", { error: error });
  } else {
    res.redirect('/home');
  }
});

app.use('/home', homeRouter);

app.use('/join', joinRouter);

// Define a route for the profile related pages
app.use('/profile', profileRouter);
  
// Define a route for the password related pages
app.use('/password', passwordRouter);

app.use('/recipes', recipesRouter);

app.use('/webcam', webcamRouter);

app.use(express.static(__dirname + "/public"));

app.use('/fuzzySearch', fuzzysearchRouter);


app.get("*", (req, res) => {
  res.status(404).render("404");
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
});