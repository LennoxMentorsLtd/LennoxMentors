import './images/about.jpg';
import './images/contact.jpg';
import './images/home.jpg';
import './images/mentoring.jpg';

const hamburger = document.querySelector('.hamburger');
const nav_items = document.querySelector('.nav-items');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav_items.classList.toggle('open');
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    hamburger.click();
  }
});

nav_items.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      hamburger.classList.remove('active');
      nav_items.classList.remove('open');
    }
  });
});
