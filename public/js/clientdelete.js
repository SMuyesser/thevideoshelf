$(document).ready(function() {
	$('ul.js-client-btn').on('click', 'button.js-delete-client-btn', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().siblings().closest('div.delete-client').toggleClass('hidden');
	});

	$('div.delete-client form#js-client-delete-form').on('submit', function(event){
		event.preventDefault();
		event.stopPropagation();
		var clientToDelete = $(this).children().children().closest('input').val()
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