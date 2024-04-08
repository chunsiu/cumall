$('#registerForm').on('submit', function(event) {
    event.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();
    const email = $('#email').val();
    const iconpath = $('#iconpath').val();

    $.ajax({
        url: 'http://localhost:3100/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password, email, iconpath }),
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
});