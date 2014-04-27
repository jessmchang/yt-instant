var videoId = 0;
var commentAPI;
var gAPI;

function handleHTML(id, content, response){
	if(response.items){	//if title/video
		var frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+id+"'frameborder='0' allowfullscreen type='text/html'></iframe>";
		$("#title").html(content);
		$("#video").html(frame);
	}
	else if (response.feed){	//if comments
		$("div[id=comment_bunch").remove();
		$("div[class=comment_author").remove();
		$("div[class=comment_content").remove();
		var i = 0;
		for(i = 0; i < content.length; i += 2){
			$("#comment_area").append("<div id='comment_bunch'><div class='comment_author'>"+content[i]+"</div><div class='comment_content'>"+content[i+1]+"</div></div>");
		}
	}
	else{
		$("#video").html("No Video");
	}
}   

var handleData = function(response) {
	var videoTitle = 0;
	if(response.items) {
		var videoIndex = 0;
		while(response.items[videoIndex].id.kind != "youtube#video"){
			videoIndex++;
		}
		var item = response.items[videoIndex];
		videoId = item.id.videoId;
		videoTitle=item.snippet.title;
		commentAPI = "http://gdata.youtube.com/feeds/api/videos/"+videoId+"/comments?v=2&alt=json&prettyprint=true";
		performAJAX(commentAPI, handleComments);
	}
	handleHTML(videoId, videoTitle, response);
}

var handleComments = function(response) {
	var displayedComments = [];
	var comments;
	var individualComment;
	var commentAuthor;
	var commentContent;
	var i = 0;
	if(response.feed){
		comments = response.feed.entry;
		while(i < 5){
			individualComment = comments[i];
			commentAuthor = individualComment.author[0].name.$t;
			commentContent = individualComment.content.$t;
			displayedComments.push(commentAuthor);
			displayedComments.push(commentContent);
			i++;
		}
	}
	handleHTML(videoId, displayedComments, response);
}

performAJAX = function(url, handleType){
	var xhr;
	if(xhr && xhr.readyState != 4){
        xhr.abort();
    }
	xhr = $.ajax
	({
		type: "GET",
		url: url,
		dataType:"jsonp",
		success: handleType
	});
}


var getData = function(data){
	console.log("Value in search: " + $(".search_box").val());
	var keyword = encodeURIComponent($(".search_box").val());
	console.log("Keyword: " + keyword);
	// console.log(keyword);
	gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyl4ObA4rSynwHIWd3k1Gr5bDRXnkYe1U';
	if(data=="views"){
		gAPI += "&orderby=viewCount";
	}
	else if (data == "published"){
		gAPI += "&orderby=published";
	}
	else if (data == "ratings"){
		gAPI += "&orderby=rating";
	}

	// var gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyGiCD-y9ym0Bw4S3a3dTOYzXxr-BPBjE';
	//Perform AJAX Call.
	console.log(gAPI);
	performAJAX(gAPI, handleData);
	
}

$("relevance").click(getData("relevance"));
$("views").click(getData("views"));
$("published").click(getData("published"));
$("ratings").click(getData("ratings"));

$(document).ready(function() {
	console.log("ready");
	// getData("#relevance");
	$(".search_box").keyup(getData("relevance"));

	

});