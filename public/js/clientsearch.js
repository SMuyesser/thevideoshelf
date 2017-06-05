$(document).ready(function() {
	$('#js-search-client-form').on('submit', function(event){
		event.preventDefault();
		var searchForClient = $('#js-search-client option:selected').val();
		$.ajax({
			url: '/users/searchclient/' + searchForClient,
			method: 'GET'
		})
		.then(function(res){
			res.render('clientpage');
		})
	});
})