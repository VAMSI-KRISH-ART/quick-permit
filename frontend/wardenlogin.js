document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('wardenLoginForm');
  const adminIdInput = document.getElementById('adminId');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const adminIdError = document.getElementById('adminId-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const togglePassword = document.querySelector('.toggle-password');

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault(); // CHANGED: Always prevent default

      // --- Validation (unchanged) ---
      let isValid = true;
      adminIdError.textContent = '';
      emailError.textContent = '';
      passwordError.textContent = '';
      adminIdInput.parentElement.classList.remove('input-shake');
      emailInput.parentElement.classList.remove('input-shake');
      passwordInput.parentElement.classList.remove('input-shake');

      if (adminIdInput.value.trim() === '') {
        adminIdError.textContent = 'Admin ID is required';
        adminIdInput.parentElement.classList.add('input-shake');
        isValid = false;
      }
      if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required';
        emailInput.parentElement.classList.add('input-shake');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address';
        emailInput.parentElement.classList.add('input-shake');
        isValid = false;
      }
      if (passwordInput.value === '') {
        passwordError.textContent = 'Password is required';
        passwordInput.parentElement.classList.add('input-shake');
        isValid = false;
      }
      if (!isValid) return;

      // --- ADDED: API Call to Python Backend ---
      const formData = {
        adminId: adminIdInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
      };
      
      fetch('http://localhost:5000/warden/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message) });
          }
          return response.json();
        })
        .then(data => {
          if (data.access_token) {
            // Save token and redirect
            localStorage.setItem('warden_token', data.access_token);
            window.location.href = 'warden_dashboard.html';
          }
        })
        .catch(error => {
          console.error('Login Error:', error);
          passwordError.textContent = error.message || 'Login failed.';
          passwordInput.parentElement.classList.add('input-shake');
        });
    });
  }
});