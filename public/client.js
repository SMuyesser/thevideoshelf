$('#btn-signup-submit').on('click', addClient);
module.exports.newClient = function(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var password = $('form.form-signup #inputPassword').val();
    var confirmPass = $('form.form-signup #confirmPassword').val();

    if (password !== confirmPass) {
    	alert("Password and confirm password do not match.")
    } else {

        // If it is, compile all user info into one object
        var newFormClient = {
		    'name': $('form.form-signup #inputName').val(),
		    'email': $('form.form-signup #inputEmail').val(),
            'password': $('form.form-signup #inputPassword').val(),
		    'facebook': $('form.form-signup #facebook').val(),
		    'instagram':$('form.form-signup #instagram').val(),
		    'twitter': $('form.form-signup #twitter').val()
		}
    return newFormClient;
};
