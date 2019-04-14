var articles= [];
// Grab the articles as a json
 
  // For each one
  $(".dropdown-menu li a").click(function(){
    $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
  });


$(document).on("click", ".saveArt", function(){
  $(this).addClass('clicked')
  var id= ($(this).attr("positionid"))
  var title= ($('.title'+id).text())
  var link= ($('.link'+id).attr('href'))
  console.log(id)
  console.log(title)
  console.log(link)
  $.ajax({
    method:"POST",
    url:"/articles/save",
    data:{ 
      title: title,
      link:link
    }
  }).then(function(){
    console.log('saved')
  })
  
  
})

$(document).on("click", "#savedArticles",function(){
  $.ajax({
    method:"Get",
    url:"/articles"
  }).then(function(results){
    console.log("viewing saved")
    console.log(results)
    location.href = "/articles"
  })
})

$(document).on("click", ".saved", function() {

  // Empty the notes from the note section
  $("#notes").empty();

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      var span = document.getElementsByClassName("close")[0];
      var modal = document.getElementById('myModal');
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
      modal.style.display = "block";
      span.onclick = function() {
        modal.style.display = "none";
      }
    

      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }

    });
  })
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      $("#myModal").css("display","none")
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
      
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$("#scrape").on("click",function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function(result){
    // console.log(result)
    // articles.push(result)
    // displayPage(result)
    location.href="/scrape"
})
})

$(document).on("click", ".delete",function(){
  var id = {info: $(this).attr("data-id")}
  console.log(id)
  $.ajax({
    method:"DELETE",
    url:"/delete/"+ id.info,
  }).then(function(res){
    console.log("worked")
    console.log(res)
    window.location.reload();
  })
})


//Changes to make:
// Create a database of "saved" articles
//add delete functionality