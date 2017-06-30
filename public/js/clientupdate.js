$(document).ready(function() {

//submit client update form with updated info and add any additional videos and then redirect to clientlist
	$('form#js-client-update-form').on('submit', function(event){
		event.preventDefault();
		var clientToUpdate = $(this).children().children().closest('input').val();
		var updateName = $(this).children().children().closest('#js-update-name').val();
		var updateLogo = $(this).children().children().closest('#js-update-logo').val();
		var updateVideos = [];
		$(this).children().children().closest('div.update-video-group').children().closest('input[name="updatedVideos[]"]')
		.each(function() {
			var url = $(this).val();
			if (url.length > 0) {
				updateVideos.push(url);
			}
		});
		
		var updateData = {
			name: updateName,
			logo: updateLogo,
			videos: updateVideos
		}

		var request = $.ajax({
			url: '/users/clientlist/' + clientToUpdate,
			method: 'PUT', 
			data: updateData
		});

		request.done(function(event) {
			window.location.href = "/users/clientlist";
		});

		request.fail(function(event) {
			$('#update-error-msg').removeClass('hidden');
		})
	});

//remove video button on edit client page which clears video url
	$('div.update-video-group').on('click', 'button.js-client-page-remove-vid-btn', function(event){
		const btnNumber = $(this).attr('id');
		$(this).siblings().closest('input#video-'+btnNumber+'').val("");
		$(this).siblings().closest('input#video-'+btnNumber+'').attr('placeholder', 'This Video Will Be Deleted After Submit Below');
	});
	
	$('form#js-client-update-form').children().children().closest('div.update-video-group')
	.children().closest('input[name="updatedVideos[]"]')
	.each(function() {
		var videoUrl = $(this).val();
		var getIdFromUrl = (videoUrl) => {
  			var splitArr = videoUrl.split("/");
  			return splitArr[3]
		}
		var videoId = getIdFromUrl(videoUrl);
		var vimRequest = $.ajax({
			url: '/vimeo/info'
		})
	});

})