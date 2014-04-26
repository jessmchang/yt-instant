function fillHTML(id, title, response){
	if(response.items){
		var frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+id+"'frameborder='0' allowfullscreen type='text/html'></iframe>";
		$("#title").html(title);
		$("#video").html(frame);
		// final="<div id='title'>"+title+"</div><div id='video'>"+frame+"</div>";
	}
	else{
		$("#video").html("No Video");
		// final = "<div id='no'>No Video</div>"
	}
}

var handleData = function(response) {
	var videoId = 0;
	var videoTitle = 0;
	if(response.items) {
		var videoIndex = 0;
		while(response.items[videoIndex].id.kind != "youtube#video"){
			videoIndex++;
		}
		var item = response.items[videoIndex];
		videoId = item.id.videoId;
		videoTitle=item.snippet.title;
	}
	fillHTML(videoId, videoTitle, response);
}


var getData = function(){
	console.log("fetching data");
	var keyword = encodeURIComponent($(this).val());
	console.log(keyword);
	var gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyl4ObA4rSynwHIWd3k1Gr5bDRXnkYe1U';	
	var xhr;
	if(xhr && xhr.readyState != 4){
        xhr.abort();
    }
	xhr = $.ajax
	({
		type: "GET",
		url: gAPI,
		dataType:"jsonp",
		success: handleData
	});
}

$(document).ready(function() {
	console.log("ready");
	getData();
	$(".search_box").keyup(getData);
});