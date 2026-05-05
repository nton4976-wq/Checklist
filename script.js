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

//* PRINTED FORMS ACCORDION */
const cards = Array.from(document.querySelectorAll('[data-accordion]'));

function setBodyHeight(card) {
  const body = card.querySelector('.form-expand');
  if (!body) return;

  body.style.maxHeight = body.scrollHeight + 50 + 'px';
}

function openCard(card) {
  cards.forEach(other => {
    if (other !== card) {
      other.classList.remove('open');
      const otherBody = other.querySelector('.form-expand');
      if (otherBody) otherBody.style.maxHeight = '0px';
    }
  });

  card.classList.add('open');

  const body = card.querySelector('.form-expand');
  if (body) {
    body.style.maxHeight = 'none'; // reset first
    setTimeout(() => {
      setBodyHeight(card);
    }, 10);
  }
}

function closeCard(card) {
  card.classList.remove('open');
  const body = card.querySelector('.form-expand');
  if (body) body.style.maxHeight = '0px';
}

function toggleCard(card) {
  if (card.classList.contains('open')) {
    closeCard(card);
  } else {
    openCard(card);
  }
}

cards.forEach(card => {
  const header = card.querySelector('.form-header');
  if (!header) return;

  header.addEventListener('click', () => {
    toggleCard(card);
  });
});

/* 🔥 OPEN NSRP BY DEFAULT (stable) */
window.addEventListener('load', () => {
  setTimeout(() => {
    if (cards.length > 0) {
      openCard(cards[0]); // NSRP
    }
  }, 150);
});

/* keep height correct on resize */
window.addEventListener('resize', () => {
  const open = document.querySelector('.form-card.open');
  if (open) setBodyHeight(open);
});

/* fix for images loading */
document.querySelectorAll('.form-image').forEach(img => {
  if (!img.complete) {
    img.addEventListener('load', () => {
      const open = document.querySelector('.form-card.open');
      if (open) setBodyHeight(open);
    });
  }
});

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

document.querySelector('.forms-progress-box h1').textContent = percent + '%';
document.querySelector('.forms-progress-box .completed h2').textContent = `${completed} / ${total}`;
document.querySelector('.forms-progress-box .progress-fill').style.width = percent + '%';
