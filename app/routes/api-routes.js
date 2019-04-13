//create a get route for displaying all the scrapped pages to the page
// Dependencies
// =============================================================
// var connection = require("../config/connection");
var db = require("../../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){
  app.get("/scrape", function(req, res) {
    var updatedArticles=0
    // First, we grab the body of the html with axios
    axios.get("https://old.reddit.com/r/webdev").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("p.title").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
        .text();
      result.link = $(this)
        .children()
        .attr("href");
        // Send a message to the client
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log("===============================")
            // View the added result in the console
            res.send(updatedArticles++)
            console.log(dbArticle);
          }).then(function(){
            console.log("This amount of new posts: " + updatedArticles)
          })
          .catch(function(err) {

            console.log("*******************************")
            // If an error occurred, log it
            console.log(err);
          });
          
      });
  
     
    });
    
  });

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        console.log(dbArticle)
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle)
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles/:id", function(req,res){
  db.Note.create(req.body).then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    
  })
      .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
})


}