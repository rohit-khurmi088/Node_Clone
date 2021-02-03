/* COMMPON SHARED CODE */

//-------------------------------------------------------------------
//1)/* Enable disabled button when user starts typing - textarea (KEYUP EVENT)*/
//-------------------------------------------------------------------
//textarea id = postTextarea
//button id = submitPostButton

    // -> get the textarea value as user types(KEYUP EVENT)
    $("#postTextarea").keyup((event)=>{
        var textarea = $(event.target);
        var value = textarea.val().trim();
        //console.log(value);

        //Enable/disable this button based on textarea is empty OR not
        var submitButton = $("#submitPostButton");
        if(submitButton.length == 0) 
            return console.log('submit button disabled');
        
        //if textarea value is empty -> disabled
        if(value == ""){
            submitButton.prop("disabled",true);
            return;
        }
        //textarea value is not empty
        submitButton.prop("disabled",false);
    });

//-------------------------------------------------
//2) Submit Form when Button Pressed(AJAX) - CLICK
//--------------------------------------------------
    $("#submitPostButton").click((event)=>{
        var button = $(event.target);
        var textBox = $("#postTextarea");

        //Data => textBox-value
        var data ={
            //content(Text) submitted in the textarea
            content:textBox.val(),
        }

        //AJAX POST Request
        $.post("/api/posts", data, (postData,status,xhr)=>{

            //-- postData => complete database of Post --
            console.log(postData);

            //** passing this function to template => returns posted data **
            //1) returning textarea-value
            var html = createPostHtml(postData); 

            //2) prepend(At beginning) the textarea-value at the start of '.postsContainer'
            $(".postsContainer").prepend(html);

            //3) Clearing textarea-value on posting(submitting) form
            textBox.val("");

            //4) Disable Post button on submitting(Post)
            button.prop("disabled",true);
        });
    });

    //RETURNING -> textarea-value 
    function createPostHtml(postData){
        //returning -> textBox-value
        //-- postData => complete database of Post --
        //return postData.content;

        //Extracting user info. from postData
        var postedBy = postData.postedBy;
        var displayName = postedBy.firstName +" "+ postedBy.lastName;
    
        //timeStamp
        var timeStamp = postData.createdAt;

        return `<div class='post'>
                    <div class='mainContentContainer'>
                        <div class='userImageContainer'> 
                            <img src='${postedBy.profilePic}'>
                        </div>
                        <div class='postContentContainer'>
                            <div class='header'>
                                <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                                <span class='userName'>${postedBy.username}</span>
                                <span class='date'>${timeStamp}</span>
                            </div>
                            <div class='postBody'>
                                <span>${postData.content}</span>
                            </div>
                            <div class='postFooter'>
                                <div class='postButtonContainer'>
                                    <button>
                                        <i class="far fa-comments"></i>
                                    </button>
                                <button>
                                    <i class="fas fa-retweet"></i>
                                </button>
                                <button>
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                      </div> 
                   </div>
                <div>`;
    }
