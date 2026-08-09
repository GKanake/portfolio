$(document).ready(function () {
  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  $('#menu').click(function () {
    $(this).toggleClass('fa-times');
    $('header').toggleClass('toggle');
  });

  $(window).on('scroll load', function () {
    $('#menu').removeClass('fa-times');
    $('header').removeClass('toggle');
  });

  // ==========================================
  // SMOOTH SCROLLING
  // ==========================================
  $('a[href*="#"]').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top,
    }, 600, 'easeInOutExpo');
  });

  // ==========================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  const sections = $('section');
  const navLinks = $('.nav-link');

  $(window).on('scroll', function () {
    let current = '';
    sections.each(function () {
      const sectionTop = $(this).offset().top;
      const sectionHeight = $(this).outerHeight();
      if ($(window).scrollTop() >= sectionTop - 200) {
        current = $(this).attr('id');
      }
    });

    navLinks.removeClass('active');
    navLinks.each(function () {
      if ($(this).attr('href') === '#' + current) {
        $(this).addClass('active');
      }
    });

    // Back to top visibility
    if ($(window).scrollTop() > 500) {
      $('.back-to-top').addClass('visible');
    } else {
      $('.back-to-top').removeClass('visible');
    }
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  $('.reveal, .reveal-left, .reveal-right').each(function () {
    observer.observe(this);
  });

  // ==========================================
  // IMAGE LIGHTBOX / MODAL - EXPAND OVERLAY
  // ==========================================
  let isModalAnimating = false;
  let panzoomInstance = null;

  $('.expandable-image').on('click', function (e) {
    e.stopPropagation();
    if (isModalAnimating) return;

    const $img = $(this);
    const imgSrc = $img.attr('src');
    const caption = $img.closest('.gallery-item').find('.gallery-overlay p').text() || '';
    const $modal = $('#imageModal');
    const $modalImg = $('#modalImg');

    // Set content before opening
    $modalImg.attr('src', imgSrc);
    $('.modal-caption').text(caption);

    // Trigger CSS expand animation
    isModalAnimating = true;
    $modal.addClass('active');
    $('body').css('overflow', 'hidden');

    // Initialize panzoom only after expand animation finishes
    setTimeout(() => {
      if (panzoomInstance) {
        $modalImg.panzoom('destroy');
      }
      $modalImg.css('transform', 'scale(1)');

      panzoomInstance = $modalImg.panzoom({
        minScale: 1,
        maxScale: 6,
        increment: 0.25,
        contain: 'invert',
        cursor: 'grab',
        disablePan: false,
        disableZoom: false
      });

      // Mouse wheel zoom support
      $modalImg.parent().off('mousewheel.focal').on('mousewheel.focal', function(e) {
        e.preventDefault();
        const delta = e.delta || e.originalEvent.wheelDelta;
        const zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        $modalImg.panzoom('zoom', zoomOut, {
          animate: true,
          focal: e
        });
      });

      isModalAnimating = false;
    }, 500);
  });

  // Close handlers
  $('.close, .modal-backdrop').on('click', function () {
    closeModal();
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    if (isModalAnimating) return;

    const $modal = $('#imageModal');
    const $modalImg = $('#modalImg');

    // Trigger CSS shrink animation
    $modal.removeClass('active');
    $('body').css('overflow', '');

    // Clean up panzoom after close animation completes
    setTimeout(() => {
      if (panzoomInstance) {
        $modalImg.panzoom('destroy');
        panzoomInstance = null;
      }
      $modalImg.css('transform', '');
      $modalImg.parent().off('mousewheel.focal');
      $modalImg.attr('src', ''); // Prevent flash of old image on next open
    }, 400);
  }

  // Prevent closing when clicking the image itself (allow panning)
  $('.modal-content-wrapper').on('click', function (e) {
    e.stopPropagation();
  });

  // ==========================================
  // EASING EXTENSION
  // ==========================================
  jQuery.extend(jQuery.easing, {
    easeInOutExpo: function (x, t, b, c, d) {
      if (t === 0) return b;
      if (t === d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  });
});
