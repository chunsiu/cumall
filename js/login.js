$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
      e.preventDefault();
  
      var username = $('#username').val();
      var password = $('#password').val();
  
      $.ajax({
        url: 'http://localhost:3100/login',
        type: 'POST',
        data: {
          username: username,
          password: password
        },
        success: function(response) {
          if(response.status === 'success') {
            console.log('Login successful');
            alert('Login successful');
            // Handle successful login here
          } else {
            console.log('Invalid username or password');
            alert('Invalid username or password');
            // Handle login failure here
          }
        },
        error: function(error) {
          console.log('An error occurred:', error);
          // Handle error here
        }
      });
    });
  });