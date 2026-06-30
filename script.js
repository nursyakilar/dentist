/* ===========================================================
   BRIGHT SMILE DENTAL CLINIC — SCRIPT
   Pure vanilla JS. No dependencies.
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu after a link is tapped (mobile)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- FAQ accordion ---------- */
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items (single-open accordion keeps the page tidy)
      triggers.forEach(function (other) {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.closest('.accordion-item').classList.remove('open');
        }
      });

      // Toggle current item
      trigger.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ---------- Scroll reveal animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 8 ? '0 4px 14px -8px rgba(46,52,56,0.15)' : 'none';
    }

    // Back to top button visibility
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.classList.toggle('visible', y > 480);
    }

    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top button ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Appointment request form ---------- */
  var form = document.getElementById('appointmentForm');
  var formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();

      if (!name || !phone) {
        formNote.textContent = 'Please fill in your name and phone number so we can reach you.';
        formNote.style.color = '#c0594f';
        return;
      }

      // No backend in this build — in production this would POST to a server
      // or trigger a WhatsApp deep link with the pre-filled details.
      var treatment = form.treatment.value;
      var message = form.message.value.trim();

      var waText = encodeURIComponent(
        'Hi Bright Smile! I would like to request an appointment.\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone +
        (treatment ? '\nTreatment: ' + treatment : '') +
        (message ? '\nNote: ' + message : '')
      );

      formNote.textContent = 'Thanks, ' + name.split(' ')[0] + '! Opening WhatsApp to confirm your request…';
      formNote.style.color = '';

      window.open('https://wa.me/15551234567?text=' + waText, '_blank', 'noopener');

      form.reset();
    });
  }

});
