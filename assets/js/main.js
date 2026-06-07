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

  var certificateCarousel = document.getElementById('certificateCarousel');
  if (certificateCarousel) {
    var certificateSlides = document.getElementById('certificateSlides');
    var certificateIndicators = document.getElementById('certificateIndicators');
    var certificateFallback = document.getElementById('certificateFallback');
    var certificateControls = certificateCarousel.querySelectorAll('.carousel-control-prev, .carousel-control-next');

    // Auto-detected image files uploaded to assets/images/certificates
    var certificateImageFiles = [
      'assets/images/certificates/Agile Testing.png',
      'assets/images/certificates/cert10.png',
      'assets/images/certificates/cert11.png',
      'assets/images/certificates/cert12.png',
      'assets/images/certificates/cert13.png',
      'assets/images/certificates/cert14.png',
      'assets/images/certificates/Cert2.png',
      'assets/images/certificates/cert3.png',
      'assets/images/certificates/cert4.png',
      'assets/images/certificates/cert5.png',
      'assets/images/certificates/cert6.png',
      'assets/images/certificates/cert7.png',
      'assets/images/certificates/cert8.png',
      'assets/images/certificates/cert9.png'
    ];

    function encodeAssetPath(path) {
      return path.split('/').map(function (segment) {
        return encodeURIComponent(segment);
      }).join('/');
    }

    function showCertificateFallback() {
      certificateCarousel.classList.add('d-none');
      if (certificateFallback) {
        certificateFallback.classList.remove('d-none');
      }
    }

    function createIndicator(index, isActive) {
      var indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.setAttribute('data-bs-target', '#certificateCarousel');
      indicator.setAttribute('data-bs-slide-to', String(index));
      indicator.setAttribute('aria-label', 'Slide ' + String(index + 1));

      if (isActive) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      }

      return indicator;
    }

    function createSlide(photo, isActive) {
      var carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item' + (isActive ? ' active' : '');

      var frame = document.createElement('div');
      frame.className = 'certificate-frame';

      var image = document.createElement('img');
      image.className = 'd-block w-100';
      image.loading = 'lazy';
      image.src = encodeAssetPath(photo.src);
      image.alt = photo.title + ' certificate photo';
      frame.appendChild(image);

      carouselItem.appendChild(frame);

      return carouselItem;
    }

    function hideCarouselControls() {
      certificateControls.forEach(function (control) {
        control.classList.add('d-none');
      });
    }

    function showCarouselControls() {
      certificateControls.forEach(function (control) {
        control.classList.remove('d-none');
      });
    }

    function renderCertificateCarousel(items) {
      if (!items.length) {
        showCertificateFallback();
        return;
      }

      certificateSlides.innerHTML = '';
      certificateIndicators.innerHTML = '';

      items.forEach(function (item, index) {
        certificateSlides.appendChild(createSlide(item, index === 0));
        certificateIndicators.appendChild(createIndicator(index, index === 0));
      });

      if (items.length === 1) {
        hideCarouselControls();
        certificateIndicators.classList.add('d-none');
      } else {
        showCarouselControls();
        certificateIndicators.classList.remove('d-none');
      }

      // Attach click handlers to open modal preview
      setupCertificatePreviews();
    }

    // Build slide items from the actual image files
    var items = certificateImageFiles.map(function (fullPath) {
      var filename = decodeURIComponent(fullPath.split('/').pop());
      var title = filename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      return { title: title, src: fullPath };
    });

    if (!items.length) {
      showCertificateFallback();
    } else {
      renderCertificateCarousel(items);
    }

    function setupCertificatePreviews() {
      var modalEl = document.getElementById('certModal');
      if (!modalEl) return;

      var modalImage = document.getElementById('certModalImage');
      var modalPdfBtn = document.getElementById('certModalPdfBtn');
      var bsModal = new bootstrap.Modal(modalEl);

      var imgs = certificateSlides.querySelectorAll('img');
      imgs.forEach(function (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
          var src = img.getAttribute('src') || img.src;
          modalImage.src = src;
          modalPdfBtn.classList.add('d-none');

          // Check if a PDF with the same base name exists
          try {
            var pdfCandidate = src.replace(/\.[^/.]+$/, '.pdf');
            // Probe with HEAD to avoid downloading
            fetch(pdfCandidate, { method: 'HEAD' }).then(function (res) {
              if (res && res.ok) {
                modalPdfBtn.href = pdfCandidate;
                modalPdfBtn.classList.remove('d-none');
              } else {
                modalPdfBtn.classList.add('d-none');
              }
            }).catch(function () {
              modalPdfBtn.classList.add('d-none');
            });
          } catch (e) {
            modalPdfBtn.classList.add('d-none');
          }

          bsModal.show();
        }, { passive: true });
      });
    }
  }
})();


