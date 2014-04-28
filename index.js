/* Some Variable Declarations */
var videoId = 0;
var videoTitle = 0;
var commentAPI;
var gAPI;

/*
* handleHTML handles all HTML interactions.
* @param id: the video id
* @param content: the DOM element(s) that will be altered.
* @param response: response of API call.
*/
function handleHTML(id, content, response){
	//If a video & video title exists in the response
	if(response.items){
		var frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+id+"'frameborder='0' allowfullscreen type='text/html'></iframe>";
		$("#title").html(content);
		$("#video").html(frame);
	}
	//If comments exist in the response
	else if (response.feed){
		$("div[id=comment_bunch").remove();
		$("div[class=comment_author").remove();
		$("div[class=comment_content").remove();
		var i = 0;
		for(i = 0; i < content.length; i += 2){
			$("#comment_area").append("<div id='comment_bunch'><div class='comment_author'>"+content[i]+"</div><div class='comment_content'>"+content[i+1]+"</div></div>");
		}
	}
	//If no video.
	else{
		$("#video").html("No Video");
	}
}   

/*
* handleData is a function that deals with the response of the ajax call.
* In this case, handleData gets the video id and title.
* handleHTML function is then called to deal with the id and title.
*/
var handleData = function(response) {
	//If the response has items (video, id, title)
	if(response.items.length > 0) {
		var videoIndex = 0;
		//Finds the first video of the response. (Sometimes the first results are user channels)
		while(response.items[videoIndex].id.kind != "youtube#video"){
			videoIndex++;
		}
		//Getting the video id/title
		var item = response.items[videoIndex];
		videoId = item.id.videoId;
		videoTitle=item.snippet.title;
		commentAPI = "http://gdata.youtube.com/feeds/api/videos/"+videoId+"/comments?v=2&alt=json&prettyprint=true";
		//Perform AJAX call
		performAJAX(commentAPI, handleComments);
	}
	//If there aren't any search results for your search query.
	else{
		videoTitle="No Video Found-- Displaying Closest Match";
	}
	//Handles HTML/DOM elements
	handleHTML(videoId, videoTitle, response);
}

/*
* handleComments deal with comments.
* In this case, it gets up to 5 comments from the API and their authors.
* handleHTML is called to display those comments.
*/
var handleComments = function(response) {
	var displayedComments = [];
	var comments;
	var individualComment;
	var commentAuthor;
	var commentContent;
	var i = 0;
	if(response.feed){
		comments = response.feed.entry;
		//If there are comments
		if(comments){
			//Displaying up to 5 comments.
			while(i < 5){
				if(comments.length == i){
					break;
				}
				individualComment = comments[i];
				commentAuthor = individualComment.author[0].name.$t;
				commentContent = individualComment.content.$t;
				//displayedComments is an array that contains the comment content.
				//Every even element is the comment author, every odd element is the comment content.
				displayedComments.push(commentAuthor);
				displayedComments.push(commentContent);
				i++;
			}
		}
		//If there aren't any comments
		else{
			console.log("no comments");
		}
		
	}
	//Handles HTML
	handleHTML(videoId, displayedComments, response);
}

/*
* performAJAX is a function that performs an XMLHTTPResponse call on a URL.
* @param url: response contains Youtube data
* @param handleType: what needs to be handled (comments or video id/title)
*/
performAJAX = function(url, handleType){
	var xhr;
	//If there's an ongoing request before sending a new one, kill it.
	if(xhr && xhr.readyState != 4){
        xhr.abort();
    }
    //The ajax call.
	xhr = $.ajax
	({
		type: "GET",
		url: url,
		dataType:"jsonp",
		success: handleType
	});
}

/*
* getData is a function that determines the URL which will be used to make the API call,
* based on the search type(video that is most viewed, most recently published, or has 
* the highest rating).
*/
var getData = function(event){
	var searchType = event.data.searchType;
	var keyword = encodeURIComponent($(".search_box").val());
	gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyl4ObA4rSynwHIWd3k1Gr5bDRXnkYe1U';
	
	//searchType determines the type of video to be displayed
	//most relevant video, highest view count, published most recently, or highest rated video
	if(searchType=="views"){
		gAPI += "&order=viewcount";
	}
	else if (searchType == "published"){
		gAPI += "&order=date";
	}
	else if (searchType == "ratings"){
		gAPI += "&order=rating";
	}
	performAJAX(gAPI, handleData);
	
}

/*
* Actions to be performed on window onload.
*/
$(document).ready(function() {
	console.log("ready");
	//When user strikes a key, call getData function
	$(".search_box").bind('keyup', {searchType: "relevance"}, getData);

	//Button onclicks.
	$("#relevance").bind('click', {searchType: "relevance"}, getData);
	$("#views").bind('click', {searchType: "views"}, getData);
	$("#published").bind('click', {searchType: "published"}, getData);
	$("#ratings").bind('click', {searchType: "ratings"}, getData);

	

});