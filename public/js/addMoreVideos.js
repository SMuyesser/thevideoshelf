$(document).ready(function() {
	var counter = 1;
	$('button#addMoreVideos-btn').click(function(event){
		$('div.video-group').append('<label>Video Url</label>');
		$('div.video-group').append('<input type="text" class="form-control" placeholder="Enter Video Url" name="videos[]">');
	});

	$('button#update-add-video-btn').click(function(event){
		counter++;
		$('div.update-video-group').append('<label>Add Video</label>');
		$('div.update-video-group').append('<input type="text" class="form-control" placeholder="Enter Video Url" name="updatedVideos[]">');
	});
})