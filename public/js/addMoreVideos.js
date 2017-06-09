$(document).ready(function() {
	var i = 1;
	$('button#addMoreVideos-btn').click(function(event){
		i++;
		$('div.video-group').append('<input type="text" class="form-control" placeholder="Enter Video Url" id="js-update-videos'+i+'" name="updatedVideos[]">');
	});
})