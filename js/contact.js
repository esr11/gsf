document.addEventListener('DOMContentLoaded', () => {
    // Example: Add animations when the page loads
    const elementsToAnimate = document.querySelectorAll('.slide-in-left, .slide-in-right, .fade-in');
    elementsToAnimate.forEach(element => {
      element.classList.add('animate');
    });
  });
  document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });