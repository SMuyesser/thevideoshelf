$(document).ready(function() {
	$('#js-client-update-form').on('submit', function(event){
		event.preventDefault();
		var clientToUpdate = $('#js-update-client option:selected').val();
		var updateName = $('#js-update-name').val();
		var updateLogo = $('#js-update-logo').val();
		var updateVideos = $('#js-update-videos').val();
		var updateData = {
			name: updateName,
			logo: updateLogo,
			videos: updateVideos
		}
		$.ajax({
			url: '/users/clientlist/' + clientToUpdate,
			method: 'PUT', 
			data: updateData
		})
		.then(function(res){
			console.log(res);
		})
	});
})