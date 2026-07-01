/* Upper Shield Roofing - shared behavior */

document.addEventListener('DOMContentLoaded', function () {

  /* Active nav state */
  var page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('.nav-links a[data-nav]').forEach(function (link) {
      if (link.getAttribute('data-nav') === page) link.classList.add('is-active');
    });
  }

  /* Hamburger */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* Carousels */
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prev = carousel.querySelector('.carousel-btn.prev');
    var next = carousel.querySelector('.carousel-btn.next');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    if (!track || !slides.length) return;

    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 1100) return 2;
      return 3;
    }

    function pageCount() {
      return Math.max(1, slides.length - perView() + 1);
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pageCount(); i++) {
        (function (i) {
          var b = document.createElement('button');
          b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          b.addEventListener('click', function () { index = i; update(); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }

    function update() {
      var max = pageCount() - 1;
      if (index > max) index = max;
      if (index < 0) index = 0;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var slideW = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * slideW) + 'px)';
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
        });
      }
    }

    if (prev) prev.addEventListener('click', function () { index--; update(); });
    if (next) next.addEventListener('click', function () { index++; update(); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); update(); }, 150);
    });

    buildDots();
    update();
  });

  /* Form validation */
  var form = document.querySelector('form[data-validate]');
  if (form) {
    form.addEventListener('submit', function (e) {
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var ok = input.value.trim() !== '';
        if (ok && input.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if (field) field.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        var firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (firstBad) firstBad.focus();
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('invalid') && input.value.trim() !== '') {
          field.classList.remove('invalid');
        }
      });
    });
  }

});
