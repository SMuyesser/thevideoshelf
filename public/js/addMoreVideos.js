$(document).ready(function() {
	//button to add more input fields for video urls during client register
	$('button#addMoreVideos-btn').click(function(event){
		$('div.video-group').append('<div class="add-more-videos" <label style="margin-top: 10px; color: #C4BF37;">Video Url</label></br><input style="width: 88%; display: inline-block; margin-right: 2%;  margin-top: 5px;" type="text" class="form-control" placeholder="Enter Vimeo Video Url" name="videos[]"><button type="button" style="display: inline-block; width: 10%" class="btn btn-danger" id="removeMoreVideos-btn">Remove</button></br></div>');
	});

	//button to remove additional video input fields
	$('div.video-group').on('click', 'button#removeMoreVideos-btn', function(event){
		$('.video-group div.add-more-videos:last-child').remove();
	});

	//button to add more input fields for video urls on edit page
	$('button#update-add-video-btn').click(function(event){
		$('div.update-video-group').append('<label style="margin-top: 10px;">Add Video</label></br><input style="width: 87%; display: inline-block; margin-right: 2%;" type="text" class="form-control" placeholder="Enter Vimeo Video Url" name="updatedVideos[]"><button type="button" style="display: inline-block; width: 10%" class="btn btn-danger" id="removeMoreUpdateVideos-btn">Remove</button></br>');
	});

	//button to remove additional input fields on edit page
	$('div.update-video-group').on('click', 'button#removeMoreUpdateVideos-btn', function(event){
		$('label').last().remove();
		$('input').last().remove();
		$('br').last().remove();
		$('br').last().remove();
		$(this).closest('button#removeMoreUpdateVideos-btn').last().remove();
	});
})