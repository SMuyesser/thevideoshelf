$(document).ready(function() {
	$('button#addMoreVideos-btn').click(function(event){
		$('div.video-group').append('<label style="margin-top: 10px;">Video Url</label>');
		$('div.video-group').append('<input type="text" class="form-control" placeholder="Enter Video Url" name="videos[]">');
	});

	$('button#update-add-video-btn').click(function(event){
		$('div.update-video-group').append('<label>Add Video</label>');
		$('div.update-video-group').append('<input type="text" class="form-control" placeholder="Enter Video Url" name="updatedVideos[]">');
	});
})