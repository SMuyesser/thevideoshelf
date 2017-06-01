$(document).ready(function() {
	$('#js-client-update-form').on('submit', function(event){
		event.preventDefault();
		var clientToUpdate = $('#js-update-client option:selected').val();
		console.log(clientToUpdate);
		$.ajax({
			url: '/users/clientlist/' + clientToUpdate,
			method: 'PUT'
		})
		.then(function(res){
			console.log(res);
		})
	});
})