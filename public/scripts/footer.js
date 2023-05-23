// Get the current page URL
var currentPage = window.location.pathname;

// Get all the navigation links
var navLinks = document.querySelectorAll('nav .nav-link');

// Loop through the links and check if the href matches the current page
navLinks.forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});