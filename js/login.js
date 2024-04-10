import { session_login_user} from './class.js';
$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
      e.preventDefault();
  
      var username = $('#email').val();
      var password = $('#password').val();
  
      $.ajax({
        url: 'http://localhost:3100/login',
        type: 'POST',
        data: {
          username: username,
          password: password
        },
        success: function(response) {
          console.log(response);
          if(response.status === 'success') {
            
            console.log('Login successful');
            alert('Login successful');
            // Handle successful login here
            var userid = response.user.userid;
            var name = response.user.username;
            alert(userid);
            session_login_user(userid,name);
            window.location.href = "index.html";
           

          } else {
            console.log('Invalid email or password');
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