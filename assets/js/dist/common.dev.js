"use strict";

/* COMMPON SHARED CODE */
//-------------------------------------------------------------------
//1)/* Enable disabled button when user starts typing - textarea (KEYUP EVENT)*/
//-------------------------------------------------------------------
//textarea id = postTextarea
//button id = submitPostButton
// -> get the textarea value as user types(KEYUP EVENT)
$("#postTextarea").keyup(function (event) {
  var textarea = $(event.target);
  var value = textarea.val().trim(); //console.log(value);
  //Enable/disable this button based on textarea is empty OR not

  var submitButton = $("#submitPostButton");
  if (submitButton.length == 0) return console.log('submit button disabled'); //if textarea value is empty -> disabled

  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  } //textarea value is not empty


  submitButton.prop("disabled", false);
}); //-------------------------------------------------
//2)POST: Submit Form when Button Pressed(AJAX) - CLICK
//--------------------------------------------------

$("#submitPostButton").click(function (event) {
  var button = $(event.target);
  var textBox = $("#postTextarea"); //Data => textBox-value

  var data = {
    //content(Text) submitted in the textarea
    content: textBox.val()
  }; //----- AJAX POST Request -----

  $.post("/api/posts", data, function (postData, status, xhr) {
    //-- postData => complete database of Post --
    console.log(postData); //** passing this function to template => returns posted data **
    //1) returning textarea-value

    var html = createPostHtml(postData); //2) prepend(At beginning) the textarea-value at the start of '.postsContainer'

    $(".postsContainer").prepend(html); //3) Clearing textarea-value on posting(submitting) form

    textBox.val(""); //4) Disable Post button on submitting(Post)

    button.prop("disabled", true);
  });
}); //-------------------------
// LIKE's Button Handler
//--------------------------
//document.on => to load this on page (Dynamic content)
//$(document).on(event,class/id, ()=>{});

$(document).on("click", ".likeButton", function (event) {
  //alert("Liked Button Pressed");
  //--- When Button is clicked -
  // ----- find root level POST & get postId(data-id) from it ----
  var button = $(event.target); //console.log(button);

  var postId = getPostIdfromElement(button); //console.log(postId);
  //----- AJAX Update -----
  //UPDATE heart(Like button) when 
  //api/posts/:Id/like

  $.ajax({
    url: "/api/posts/".concat(postId, "/like"),
    type: "PUT",
    success: function success(postData) {
      // console.log(postData.likes.length);
      //Find Span element in button + update text of it
      button.find("span").text(postData.likes.length || ""); //** CHECK IF USER has liked the Post or not **
      //(Check if:userId exists in Likes array of Post)

      if (postData.likes.includes(userJs._id)) {
        //add active class to button
        button.addClass("active");
      } else {
        //remove active class to button
        button.removeClass("active");
      }
    }
  });
}); //-------------------------
// RETWEET POST Button Handler
//--------------------------
//document.on => to load this on page (Dynamic content)
//$(document).on(event,class/id, ()=>{});

$(document).on("click", ".retweetButton", function (event) {
  //alert("Retweet Button Pressed");
  //--- When Button is clicked -
  // ----- find root level POST & get postId(data-id) from it ----
  var button = $(event.target); //console.log(button);

  var postId = getPostIdfromElement(button); //console.log(postId);
  //----- AJAX Update -----
  //UPDATE heart(Like button) when 
  //api/posts/:Id/like

  $.ajax({
    url: "/api/posts/".concat(postId, "/retweet"),
    type: "POST",
    success: function success(postData) {
      console.log(postData); // console.log(postData.retweetUsers.length);
      //Find Span element in button + update text of it

      button.find("span").text(postData.retweetUsers.length || ""); //** CHECK IF USER has retweet the Post or not **
      //(Check if:userId exists in retweetUsers array of Post)

      if (postData.retweetUsers.includes(userJs._id)) {
        //add active class to button
        button.addClass("active");
      } else {
        //remove active class from button
        button.removeClass("active");
      }
    }
  });
}); //______________________________
// GET Post_ID for current Post
//______________________________

function getPostIdfromElement(element) {
  //give element then this function will loop through the tree to find postId from rootElement
  //------ GET rootElement ------
  //get rootElement (rootElement has class => 'post')
  //.closest = jquery func - which goes up through the tree to find parent with specified class
  //element != root elemet => loop through tree to get rootElement
  //element = root element => dont loop through tree to get rootElement
  var isRoot = element.hasClass(".post");
  var rootElement = isRoot == true ? isRoot : element.closest(".post"); //------ GET id(For clicked post) from rootElement ------
  //data() - gives all related adata attributes to given element(eg: data-id,data-class etc...)
  //postId = post 'id' value

  var postId = rootElement.data().id; //----- Return Post_ID -----
  //If Post_ID is undefined

  if (postId === undefined) {
    return alert("Post_ID is undefined");
  } //Else 


  return postId;
} //___________________________
// createPostHtml function
//___________________________
//RETURNING -> textarea-value 


function createPostHtml(postData) {
  //returning -> textBox-value
  //-- postData => complete database of Post --
  //return postData.content;
  //--------------------------
  //CHECK if Post is retweeted
  //---------------------------
  //Is the post retweeted
  var isRetweet = postData.retweetData != undefined; //console.log(isRetweet);
  //Retweeted by

  var retweetedBy = isRetweet ? postData.postedBy.username : null; //If Post isRetweeted => set the postData to retweetedData

  postData = isRetweet ? postData.retweetData : postData;
  /** RETWEETED POST html TEXT **/

  var retweetText = ''; //Set retweet Text (if post is retweeted)

  if (isRetweet) {
    var retweetText = "<span>\n                                    <i class=\"fas fa-retweet\"></i>\n                                    Retweeted by <a href='/profile/".concat(retweetedBy, "'>@").concat(retweetedBy, "</a>\n                                </span>");
  } //------------------------
  //Extracting user info. from postData


  var postedBy = postData.postedBy;
  var displayName = postedBy.firstName + " " + postedBy.lastName; //timeStamp
  //var timeStamp = postData.createdAt;

  var timeStamp = timeDifference(new Date(), new Date(postData.createdAt)); //** Check if postData EXISTS (passed)**/

  if (postData == undefined) {
    return console.log("Post object is null");
  } //Check if no user for Post Exists =>Post not populated for 'User' data


  if (postedBy._id === undefined) {
    console.log('POST -> User object not Populated');
  } //*****MAKE LIKE BUTTON still active when user refresh the page*****
  //if user is logged in -> show likes(red)
  //Show all Posts liked by the user -> when user is logged in


  var likeButtonActiveClass = postData.likes.includes(userJs._id) ? "active" : " "; //*****MAKE RETWEET BUTTON still active when user refresh the page*****
  //if user is logged in -> show retweets(green)
  //Show all Posts Retweeted by the user -> when user is logged in

  var retweetButtonActiveClass = postData.retweetUsers.includes(userJs._id) ? "active" : " "; //Give POST_id -> to eachPost - data-id='${postData._id}'

  return "<div class='post' data-id='".concat(postData._id, "'>\n                    <!-- If POST is Retweeted-->\n                    <div class='postActionContainer'>\n                        ").concat(retweetText, "\n                    </div>\n\n                    <!-- Main Post Container -->\n                    <div class='mainContentContainer'>\n                        <div class='userImageContainer'> \n                            <img src='").concat(postedBy.profilePic, "'>\n                        </div>\n                        <div class='postContentContainer'>\n                            <div class='header'>\n                                <a href='/profile/").concat(postedBy.username, "' class='displayName'>").concat(displayName, "</a>\n                                <span class='userName'>@").concat(postedBy.username, "</span>\n                                <span class='date'>").concat(timeStamp, "</span>\n                            </div>\n                            <div class='postBody'>\n                                <span>").concat(postData.content, "</span>\n                            </div>\n                            <div class='postFooter'>\n                                <div class='postButtonContainer'>\n                                    <button>\n                                        <i class=\"far fa-comments\"></i>\n                                    </button>\n                                </div>\n                                <div class='postButtonContainer green'>\n                                    <button class='retweetButton ").concat(retweetButtonActiveClass, "'>\n                                        <i class=\"fas fa-retweet\"></i>\n                                        <span>").concat(postData.retweetUsers.length || "", "</span>\n                                    </button>\n                                </div>\n                                <div class='postButtonContainer red'>\n                                    <button class='likeButton ").concat(likeButtonActiveClass, "'>\n                                        <i class=\"far fa-heart\"></i>\n                                        <span>").concat(postData.likes.length || "", "</span>\n                                    </button>\n                                </div>\n                            </div>\n                        </div> \n                    </div>\n                <div>");
} //=================================
//JAVASCRIPT DATA -> TIMEstamp ago
//==================================


function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = current - previous; //millisec

  if (elapsed < msPerMinute) {
    //if time<30 sec
    if (elapsed / 1000 < 30) return 'Just now'; //else

    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
} //===========================