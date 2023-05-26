// For typing effect on the index page
document.addEventListener("DOMContentLoaded", function () {
  var typed = new Typed("#typedText", {
    strings: [
      "Together, let's build a sustainable food future.",
      "A mindful approach to food waste.",
      "Transforming food waste into opportunities.",
      "Driving change, one plate at a time.",
      "Empowering communities against food waste."
    ],
    typeSpeed: 20, // Speed of typing in milliseconds
    startDelay: 600, // Delay before typing starts in milliseconds
    backDelay: 1500, // Delay between strings in milliseconds
    backSpeed: 0, // Speed of deleting in milliseconds
    loop: true, // Loop the typing effect
    showCursor: false, // Hide the cursor
    smartBackspace: false // Disable smart backspace
  });
});