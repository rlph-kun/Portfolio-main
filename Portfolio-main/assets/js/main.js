(function () {
  'use strict';

  // Theme: dark mode removed

  // Set current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active nav link based on current path
  var navLinks = document.querySelectorAll('.navbar .nav-link');
  var path = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });

  // Contact form validation and Formspree submission
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        if (statusEl) statusEl.textContent = 'Please correct the errors above.';
        return;
      }

      if (statusEl) statusEl.textContent = 'Sending...';
      var formData = new FormData(form);
      fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          if (statusEl) statusEl.textContent = 'Thanks! Your message has been sent.';
          form.reset();
          form.classList.remove('was-validated');
          // Redirect to thanks page after a short delay
          setTimeout(function () { window.location.href = 'thanks.html'; }, 400);
        } else {
          return response.json().then(function (data) {
            var msg = (data && data.errors && data.errors[0] && data.errors[0].message) || 'Submission failed. Please try again later.';
            if (statusEl) statusEl.textContent = msg;
          });
        }
      }).catch(function () {
        if (statusEl) statusEl.textContent = 'Network error. Please try again.';
      });
    });
  }

  // Theme toggle removed
})();


