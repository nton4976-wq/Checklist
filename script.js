const homeScreen = document.getElementById('homeScreen');
const seminarScreen = document.getElementById('seminarScreen');
const printedFormsScreen = document.getElementById('printedFormsScreen');

const openSeminarBtn = document.getElementById('openSeminarBtn');
const openPrintedFormsBtn = document.getElementById('openPrintedFormsBtn');

const allScreens = [homeScreen, seminarScreen, printedFormsScreen];

function showScreen(screen) {
  allScreens.forEach((s) => s.classList.remove('active'));
  if (screen) screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-go="home"]').forEach((btn) => {
  btn.addEventListener('click', () => showScreen(homeScreen));
});

if (openSeminarBtn) {
  openSeminarBtn.addEventListener('click', () => showScreen(seminarScreen));
}

if (openPrintedFormsBtn) {
  openPrintedFormsBtn.addEventListener('click', () => showScreen(printedFormsScreen));
}

/* PRINTED FORMS ACCORDION */
const cards = Array.from(document.querySelectorAll('[data-accordion]'));

function setBodyHeight(card, expanded) {
  const body = card.querySelector('.form-expand');
  if (!body) return;

  if (expanded) {
    body.style.maxHeight = body.scrollHeight + 24 + 'px';
  } else {
    body.style.maxHeight = '0px';
  }
}

function closeCard(card) {
  card.classList.remove('open');
  setBodyHeight(card, false);
}

function openCard(card) {
  cards.forEach((other) => {
    if (other !== card) closeCard(other);
  });

  card.classList.add('open');
  setBodyHeight(card, true);
}

function updateHeights() {
  cards.forEach((card) => {
    setBodyHeight(card, card.classList.contains('open'));
  });
}

cards.forEach((card) => {
  const header = card.querySelector('.form-header');
  if (!header) return;

  let clickTimer = null;

  header.addEventListener('click', () => {
    if (clickTimer) return;

    clickTimer = setTimeout(() => {
      openCard(card);
      clickTimer = null;
    }, 220);
  });

  header.addEventListener('dblclick', (e) => {
    e.preventDefault();

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }

    closeCard(card);
  });
});

window.addEventListener('resize', updateHeights);
window.addEventListener('load', updateHeights);
updateHeights();

/* IMAGE MODAL */
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeImageModal = document.getElementById('closeImageModal');

document.querySelectorAll('[data-expand-image]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const imgSrc = btn.getAttribute('data-expand-image');
    const img = btn.querySelector('img');
    const imgAlt = img ? img.alt : 'Expanded image';

    if (!imageModal || !modalImage) return;

    modalImage.src = imgSrc;
    modalImage.alt = imgAlt;
    imageModal.classList.add('open');
    imageModal.setAttribute('aria-hidden', 'false');
  });
});

function closeImageViewer() {
  if (!imageModal || !modalImage) return;

  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
  modalImage.src = '';
}

if (closeImageModal) {
  closeImageModal.addEventListener('click', closeImageViewer);
}

if (imageModal) {
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeImageViewer();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImageViewer();
});
