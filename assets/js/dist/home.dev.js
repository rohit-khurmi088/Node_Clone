"use strict";

//---------------------------------
//GET: LOAD POSTS on the HomePage
//---------------------------------
//AJAX GET
$.get("/api/posts", function (results, status, xhr) {
  //console.log(results);
  //pass post container => to append posts to postContainer
  outputPosts(results, $(".postsContainer"));
}); //___________________________________
// {Function} to add Posts to container
//___________________________________

function outputPosts(results, container) {
  container.html(""); //If No Posts found!

  if (results.length == 0) {
    container.append("<span class='noResults'>Nothing to show.</span>");
  } //Loop theough eachPost


  results.forEach(function (post) {
    var html = createPostHtml(post); //append post to container

    container.append(html);
  });
}