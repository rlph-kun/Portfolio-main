(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  // Theme: dark mode removed

  // Set current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active nav link based on current path
  var navLinks = document.querySelectorAll('.navbar .nav-link');
  var path = location.pathname.split('/').pop() || 'index.html';
  var sectionIds = ['home', 'about', 'projects', 'tech', 'contact'];
  var sectionElements = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function clearNavState() {
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
  }

  function activateNav(hrefValue) {
    clearNavState();

    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === hrefValue) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function setActiveNav() {
    var hash = location.hash || '#home';

    if (path === 'index.html' || path === '') {
      if (location.hash) {
        activateNav(hash);
        return;
      }

      activateNav('#home');
      return;
    }

    activateNav(path);
  }

  setActiveNav();
  window.addEventListener('hashchange', setActiveNav);

  if ((path === 'index.html' || path === '') && sectionElements.length) {
    var ticking = false;

    function updateSectionNav(sectionId) {
      if (sectionId) {
        activateNav('#' + sectionId);
      }
    }

    function getActiveSectionId() {
      var activationLine = window.innerHeight * 0.34;
      var activeId = 'home';

      sectionElements.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var isPastActivationLine = rect.top <= activationLine;
        var isStillVisible = rect.bottom > activationLine;

        if (isPastActivationLine && isStillVisible) {
          activeId = section.id;
        } else if (rect.top <= activationLine && rect.bottom <= activationLine) {
          activeId = section.id;
        }
      });

      return activeId;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(function () {
        updateSectionNav(getActiveSectionId());
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  var revealTargets = document.querySelectorAll('.hero-section, .page-section .page-intro, .page-section .card, .page-section .surface-card, .page-section .contact-panel, .page-section .metric-card, .hero-visual');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach(function (target, index) {
      target.classList.add('reveal-on-scroll');
      target.style.setProperty('--reveal-delay', (index % 6) * 70 + 'ms');
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add('reveal-on-scroll', 'is-visible');
    });
  }

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


