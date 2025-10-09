import './images/about.jpg';
import './images/contact.jpg';
import './images/home.jpg';
import './images/mentoring.jpg';

const body = document.querySelector('body');
const hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
  body.classList.toggle('nav-open');
  hamburger.classList.toggle('active');
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    hamburger.click();
  }
});
