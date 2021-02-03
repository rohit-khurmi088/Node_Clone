//---------------------------------
//GET: LOAD POSTS on the HomePage
//---------------------------------
//AJAX GET
$.get("/api/posts", (results, status,xhr)=>{
    console.log(results);
    
    //pass post container => to append posts to postContainer
    outputPosts(results,$(".postsContainer"));
});


function outputPosts(results, container){
    container.html("");
    
    //If No Posts found!
    if(results.length == 0){
        container.append("<span class='noResults'>Nothing to show.</span>");
    }

    //Loop theough eachPost
    results.forEach(post =>{
        var html = createPostHtml(post);
        //append post to container
        container.append(html);
    });
}