// An array for the preselected sports categories
var topics = ["Basketball","Baseball","Football","Hockey","Golf","Tennis","Swimming",
                "Nascar","Horse Racing","Soccer","Snow Skiing","Water Skiing","Surfing",
                "Kite Surfing","Fishing","Sailing","Badminton","Ping Pong"];


// Variables to hold the two button groups
var newBtnGrp = $('<div class="btn-group btn-group-sm mybtngrp" role="group" aria-label="Basic example">');
var addNewBtnGrp = $('<div class="btn-group btn-group-sm myaddbtngrp" role="group" aria-label="Basic example">');

// Half the array of buttons for looks
var middle = Math.floor(topics.length/2);

for (let i = 0; i < middle; i++) {
    newBtnGrp.append(makeCatBtn(topics[i]));
}
// Append each button in order
newBtnGrp.append('<br>');

for (i=middle; i <topics.length;i++) {    
    newBtnGrp.append(makeCatBtn(topics[i]));
}

// Variables for length of search query, total search length, and position within the database list
var lengthGifSearch;
var lengthGifList=0;
var tenorGifPos = 0;
var giphyGifPos = 0;

function makeCatBtn(topic) {    
        var newBtn = $('<button type="button"></button>');
        newBtn.addClass("btn btn-info topic-btn shadow-lg mb-3 rounded");
        newBtn.css({ "font-size": "14px", "margin": "2px 3px" });
        newBtn.attr("data-topic", topic);
        newBtn.text(topic);
        return newBtn
}

// F(x) for making a checkbox 
function makeChkBox () {
    var btn = $("<button></button>");
    btn.attr("id","index-"+lengthGifList+'"');
    btn.attr("data", lengthGifList);
    btn.attr("class","checkbox");
    btn.text("X");
    return btn
}
// F(x) for making a favorites button
function makeFav () {
    var btn = $("<button></button>");
    btn.attr("id","index-"+lengthGifList+'"');
    btn.attr("data", lengthGifList);
    btn.attr("class","favorite");
    btn.append('<img src="assets/images/favsymbol.jpg" class="img-fluid">');
    return btn
}

// Query the Giphy API using the category chosen for 6 gifs
function queryGiphy (cat) {

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    cat + "&api_key=dc6zaTOxFJmzC&limit=6&offset=" + giphyGifPos;

    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        console.log(response);
        lengthGifSearch=response.data.length;
        // write all the gifs that were returned 
        for (i=0;i<response.data.length;i++){
            // increment the spot in the database list 
            giphyGifPos++;
            // Increment the total search length by the number returned
            lengthGifList++;
            // Write a new Gif card to window with the gif checkbox and fav buttons
            var newGifDiv = $('<div class="card gif-card hoverable" id="index-'+lengthGifList+'">');
            newGifDiv.append(makeFav());
            newGifDiv.append(makeChkBox());
            newGifDiv.append('<img src="'+response.data[i].images.original.url+'" frameBorder="0" class = "card-img-top my-img" data-animate="'+response.data[i].images.original.url+'" data-still="'+response.data[i].images.original_still.url+'" data-state="animate" allowFullScreen></iframe>');
            var newGifCardBody = $('<div class="card-body mycardbody">'); 
            if (response.data[i].title==""){
                newGifCardBody.append('<p class="card-text myp">Untitled</p>');
            }
            else {
                newGifCardBody.append('<p class="card-text myp">'+response.data[i].title+'</p>');    
            }
            if (response.data[i].rating==""){
                newGifCardBody.append('<p class="card-text myp">Rating: NR</p>');
            }
            else {
                newGifCardBody.append('<p class="card-text myp">Rating: '+response.data[i].rating.toUpperCase()+'</p>');
            }
            newGifDiv.append(newGifCardBody);
            $("#gif-container").append(newGifDiv);
        }
    });            
}

// url Async requesting function
function httpGetAsync(theUrl, callback)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}

// callback for Tenor API for 6 gifs
function tenorCallback_search(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    top_6_gifs = response_objects["results"];
    // Add the number of gifs returned to the Giphy count
    lengthGifSearch=lengthGifSearch+top_6_gifs.length;
    console.log(top_6_gifs);
    // write all the gifs that were returned 
    for (i=0;i<top_6_gifs.length;i++){
        // increment the spot in the database list 
        tenorGifPos++;
        // Increment the total search length by the number returned
        lengthGifList++;
        // Write a new Gif card to window with the gif checkbox and fav buttons
        var newGifDiv = $('<div class="card gif-card" id="index-'+lengthGifList+'">');
        newGifDiv.append(makeFav());
        newGifDiv.append(makeChkBox());
        newGifDiv.append('<img src="'+top_6_gifs[i].media[0].gif.url+'" frameBorder="0" class = "card-img-top my-img" data-animate="'+top_6_gifs[i].media[0].gif.url+'" data-still="'+top_6_gifs[i].media[0].gif.preview+'" data-state="animate" allowFullScreen></iframe>');
        var newGifCardBody = $('<div class="card-body mycardbody">');
        if (top_6_gifs[i].title==""){
            newGifCardBody.append('<p class="card-text myp">Untitled</p>');
        }
        else {
            newGifCardBody.append('<p class="card-text myp">'+top_6_gifs[i].title+'</p>');
        }
        newGifCardBody.append('<p class="card-text myp">Rating: NR</p>');
        newGifDiv.append(newGifCardBody);
        $("#gif-container").append(newGifDiv);
    }

    return;

}

// Setting the Tenor API url and passing the category for searching
function callTenor (cat) {

    // set the apikey and limit
    var apikey = "TKE2YUWVIGXK";
    var lmt = 6;

    // test search term
    var search_term = cat;

    // using default locale of en_US
    var search_url = "https://api.tenor.com/v1/search?tag=" + search_term + "&key=" +
            apikey + "&limit=" + lmt + "&pos=" + tenorGifPos;
    console.log(tenorGifPos);

    httpGetAsync(search_url,tenorCallback_search);
}

// Write the preselected sports category buttons to window and the added button container
$('#btn-container').append(newBtnGrp);
$('#addbtn-container').append(addNewBtnGrp);

// Click event handler for clicking any preselected category 
$(".mybtngrp").on("click",".topic-btn",function() {
    // Choose the topic and query the topic
    var chosenTopic = $(this).attr("data-topic");
    $('#gif-container').empty();
    queryGiphy(chosenTopic);
    callTenor(chosenTopic);
});
// Click event handler for clicking a user generated category 
$(".myaddbtngrp").on("click",".topic-btn",function() {
    // Query the user topic
    var chosenTopic = $(this).attr("data-topic");
    $('#gif-container').empty();
    queryGiphy(chosenTopic);
    callTenor(chosenTopic);
});

// Click event handler for entering a search category 
$("#searchBtn").on("click", function () {
    var newTopic = $('input').val(); 
    // If the search field is invalid dont write a new button or call Giphy
    if (!(newTopic == "")) {
        $('#gif-container').empty();
        queryGiphy(newTopic);
        callTenor(newTopic);
        setTimeout(function() { 
            if (!(lengthGifSearch===0)) {
                var newBtn = $('<button type="button" class="btn btn-info topic-btn shadow mb-3 rounded" style="font-size: 14px; margin: 2px 3px;" data-topic="'+newTopic+'">'+newTopic+'</button>');
                $(".myaddbtngrp").append(newBtn);
            }
        },2500);
    }
    // Clear the search input field
    $('input').val("");
}); 

// Click handler for clearing a gif from checkbox
$(".gif-class").on("click", ".checkbox", function () {
    var indexClicked = $(this).attr("data");
    $("#index-"+indexClicked).remove();
});

// Click handler for adding a gif to favorites
$(".gif-class").on("click", ".favorite", function () {
    // Add the favorites header if the first time 
    var isFavsActivated = $("#fav-container").attr("favs-activated"); 
    if (isFavsActivated == "false") {
        $("#fav-container").prepend('<div class="row alert alert-primary" role="alert" style="background: lightgray;color: black;width:80%; margin-left:25px;">Favorites</div>');
        $("#fav-container").attr("favs-activated","true");
    }
    // Grab the index info
    var indexClicked = $(this).attr("data");
    // Remove the gif from search
    this.remove();
    // Copy it to favorites container
    var copyCard = $("#index-"+indexClicked);
    $("#index-"+indexClicked).remove();
    $("#fav-gifs").append(copyCard);
});

// Click handler for clearing the search results
$("#clearBtn").on("click", function () {
    $("#gif-container").empty();
});

// Click handler for stopping  and starting the gifs 
$(".gif-class").on("click",".my-img",function() {

    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
});