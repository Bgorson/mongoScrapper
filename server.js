// Scrape reddit when the page loads and update the database with all the new posts
var db = require("./models");
const express = require('express')
const app = express()
const PORT = 3000
var mongoose = require("mongoose");
var logger = require("morgan");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("./app/public"));

//require routes
require("./app/routes/api-routes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


/*
Todo:
Display articles without saving
When "saved" add to database
Identify how many I'm pulling
Add note taking functionality
Be able to remove comments and saved articles
*/