//Logic for creating the page data that is scrapped and button events

var scrape = function() {
  $.ajax({
    method:"GET",
    url:"/scrape"
  }).then(function(data){
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<button class ='save' id= "+ data[i]._id + ">Save</button><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  })
}
    


$(document).on("click", ".save", function(){
  console.log($(this).attr("id"))
})

$("#scrape").on("click",function(){
  scrape()
})