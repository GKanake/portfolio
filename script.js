$(document).ready(function () {
  // Menu toggle
  $('#menu').click(function () {
      $(this).toggleClass('fa-times');
      $('header').toggleClass('toggle');
  });

  $(window).on('scroll load', function () {
      $('#menu').removeClass('fa-times');
      $('header').removeClass('toggle');
  });

  // Smooth scrolling for anchor links
  $('a[href*="#"]').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
          scrollTop: $($(this).attr('href')).offset().top,
      }, 500, 'linear');
  });

  // Image Expansion (Lightbox Effect)
  $('.expandable-image').click(function () {
      var imgSrc = $(this).attr('src'); // Get clicked image source
      $('#modalImg').attr('src', imgSrc); // Set modal image source
      $('#imageModal').fadeIn(); // Show modal
      $('.close').show(); // Show close button

      // Activate panzoom on the modal image
      $('#modalImg').panzoom({
          minScale: 1,
          maxScale: 5, // Allow zooming up to 3x
          contain: 'invert' // Allow free movement
      });
  });

  // Close Modal on Click (Outside Image or Close Button)
  $('#imageModal, .close').click(function () {
      $('#imageModal').fadeOut(function () {
          $('.close').hide(); // Hide close button when modal disappears
      });
  });
});
