// script.js

const homeScreen = document.getElementById('homeScreen');
const seminarScreen = document.getElementById('seminarScreen');

const openSeminar = document.getElementById('openSeminar');
const backBtn = document.getElementById('backBtn');

openSeminar.addEventListener('click', () => {
  homeScreen.classList.remove('active');
  seminarScreen.classList.add('active');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

backBtn.addEventListener('click', () => {
  seminarScreen.classList.remove('active');
  homeScreen.classList.add('active');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});