$(document).ready(function() {
	$('#js-client-delete-form').on('submit', function(event){
		event.preventDefault();
		var clientToDelete = $('#js-delete-client option:selected').val();
		console.log(clientToDelete);
		$.ajax({
			url: '/users/clientlist/' + clientToDelete,
			method: 'DELETE'
		})
		.then(function(res){
			console.log(res);
		})
	});
})