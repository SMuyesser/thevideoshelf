$(document).ready(function() {
	$('ul.js-client-btn').on('click', 'button.js-update-client-btn', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().siblings().closest('div.update-client').toggleClass('hidden');
	});

	$('div.update-client form#js-client-update-form').on('submit', function(event){
		event.preventDefault();
		var clientToUpdate = $(this).children().children().closest('input').val();
		var updateName = $(this).children().children().closest('#js-update-name').val();
		var updateLogo = $(this).children().children().closest('#js-update-logo').val();
		var updateVideos = $(this).children().children().closest('#js-update-videos').val();
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
})