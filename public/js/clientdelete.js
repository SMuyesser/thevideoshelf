$(document).ready(function() {
	$('#js-client-delete-form').on('submit', function(event){
		event.preventDefault();
		var clientToDelete = $('#js-delete-client option:selected').val();
		var request = $.ajax({
			url: '/users/clientlist/' + clientToDelete,
			method: 'DELETE'
		});
		
		request.done(function(event) {
			window.location.href = "/users/clientlist";
		});

		request.fail(function(event) {
			$('#delete-error-msg').removeClass('hidden');
		});
	});
})