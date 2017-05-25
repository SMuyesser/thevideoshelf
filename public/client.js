// Submit Signup form to post to database
$('#btn-signup-submit').on('click', newClient);


function newClient(event, callback) {
    event.preventDefault();

    var name = $('form.form-signup #inputName').val();
    var email = $('form.form-signup #inputEmail').val();
    var password = $('form.form-signup #inputPassword').val();
    var confirmPass = $('form.form-signup #confirmPassword').val();
    var facebook = $('form.form-signup #facebook').val();
    var instagram = $('form.form-signup #instagram').val();
    var twitter = $('form.form-signup #twitter').val();

    if (name === '' || email === '' || password === '') {
        alert("Missing a required field");
    } else if (password !== confirmPass) {
    	alert("Password and confirm password do not match.");
    } else if (password.length < 8) {
        alert("Password should be at least 8 characters.");
    } else {

        // If it is, compile all user info into one object
        var newFormClient = {
		    'name': name,
		    'email': email,
            'password': password,
		    'facebook': facebook,
		    'instagram': instagram,
		    'twitter': twitter
		}
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newFormClient),
            url: '/api/clients',
            contentType: 'application/json; charset=utf-8'
        })
    }
/*    function clearForm((event) {
        $('form.form-signup input') === '';
    }*/
};
