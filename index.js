require("./utils.js");

const express = require('express');
const session = require('express-session');

const app = express();
const node_session_secret = process.env.NODE_SESSION_SECRET;
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}));

app.use(express.json());

//to be updated
// app.use(session({ 
//     secret: node_session_secret,
// 	store: mongoStore, //default is memory store 
// 	saveUninitialized: false, 
// 	resave: true
// }
// ));

app.get('/', (req,res) => {
    // if (!req.session.authenticated) {
        res.render("index");
        return;
    // }
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req,res) => {
	res.status(404);
	res.render("404");
})

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 