// JavaScript for language toggle functionality
const languageToggle = document.getElementById('languageToggle');
let isEnglish = true;

languageToggle.addEventListener('click', () => {
    if (isEnglish) {
        languageToggle.textContent = 'አማርኛ'; // Change to Amharic
    } else {
        languageToggle.textContent = 'ENG'; // Change back to English
    }
    isEnglish = !isEnglish; // Toggle the language state
});
// Scroll-based animations using Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, { threshold: 0.5 });
  
    // Select all elements with animation classes
    document.querySelectorAll(".slide-in-left, .slide-in-right, .fade-in").forEach((element) => {
      observer.observe(element);
    });
  });