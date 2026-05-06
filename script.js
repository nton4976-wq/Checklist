const homeScreen = document.getElementById('homeScreen');
const seminarScreen = document.getElementById('seminarScreen');
const printedFormsScreen = document.getElementById('printedFormsScreen');

const openSeminarBtn = document.getElementById('openSeminarBtn');
const openPrintedFormsBtn = document.getElementById('openPrintedFormsBtn');
const openAlumniModalBtn = document.getElementById('openAlumniModalBtn');

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
  body.style.maxHeight = expanded ? `${body.scrollHeight + 40}px` : '0px';
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
  requestAnimationFrame(() => setBodyHeight(card, true));
  setTimeout(() => setBodyHeight(card, true), 60);
  setTimeout(() => setBodyHeight(card, true), 180);
}

function toggleCard(card) {
  if (card.classList.contains('open')) {
    closeCard(card);
  } else {
    openCard(card);
  }
}

cards.forEach((card) => {
  const header = card.querySelector('.form-header');
  if (!header) return;

  header.addEventListener('click', () => {
    toggleCard(card);
  });
});

window.addEventListener('load', () => {
  if (cards[0]) {
    openCard(cards[0]);
  }
});

window.addEventListener('resize', () => {
  const open = document.querySelector('.form-card.open');
  if (open) setBodyHeight(open, true);
});

document.querySelectorAll('.form-image').forEach((img) => {
  if (!img.complete) {
    img.addEventListener('load', () => {
      const open = document.querySelector('.form-card.open');
      if (open) setBodyHeight(open, true);
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

/* ALUMNI RECEIPT MODAL */
const receiptModal = document.getElementById('receiptModal');
const closeReceiptModal = document.getElementById('closeReceiptModal');
const verifyReceiptBtn = document.getElementById('verifyReceiptBtn');
const receiptStatus = document.getElementById('receiptStatus');
const receiptDigits = Array.from(document.querySelectorAll('.receipt-digit'));

function openReceiptModal() {
  if (!receiptModal) return;

  receiptModal.classList.add('open');
  receiptModal.setAttribute('aria-hidden', 'false');
  resetReceiptModal();
  setTimeout(() => {
    receiptDigits[0]?.focus();
  }, 60);
}

function closeReceiptModalFn() {
  if (!receiptModal) return;

  receiptModal.classList.remove('open');
  receiptModal.setAttribute('aria-hidden', 'true');
  resetReceiptModal();
}

function resetReceiptModal() {
  receiptDigits.forEach((input) => {
    input.value = '';
    input.disabled = false;
  });

  if (verifyReceiptBtn) {
    verifyReceiptBtn.disabled = true;
    verifyReceiptBtn.textContent = 'VERIFY';
    verifyReceiptBtn.classList.remove('pending');
  }

  if (receiptStatus) {
    receiptStatus.hidden = true;
    receiptStatus.textContent = 'Pending submission...';
  }
}

function updateVerifyState() {
  const filled = receiptDigits.every((input) => input.value.trim().length === 1);
  if (verifyReceiptBtn) {
    verifyReceiptBtn.disabled = !filled;
  }
}

receiptDigits.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    e.target.value = digits.slice(0, 1);

    if (e.target.value && index < receiptDigits.length - 1) {
      receiptDigits[index + 1].focus();
    }

    updateVerifyState();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      receiptDigits[index - 1].focus();
    }
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    pasted.split('').forEach((char, i) => {
      if (receiptDigits[index + i]) receiptDigits[index + i].value = char;
    });

    const nextIndex = Math.min(index + pasted.length, receiptDigits.length - 1);
    receiptDigits[nextIndex].focus();
    updateVerifyState();
  });
});

if (openAlumniModalBtn) {
  openAlumniModalBtn.addEventListener('click', openReceiptModal);
}

if (closeReceiptModal) {
  closeReceiptModal.addEventListener('click', closeReceiptModalFn);
}

if (receiptModal) {
  receiptModal.addEventListener('click', (e) => {
    if (e.target === receiptModal) closeReceiptModalFn();
  });
}

if (verifyReceiptBtn) {
  verifyReceiptBtn.addEventListener('click', () => {
    const filled = receiptDigits.every((input) => input.value.trim().length === 1);
    if (!filled || verifyReceiptBtn.disabled) return;

    verifyReceiptBtn.disabled = true;
    verifyReceiptBtn.textContent = 'PLEASE WAIT FOR APPROVAL';
    verifyReceiptBtn.classList.add('pending');

    receiptDigits.forEach((input) => {
      input.disabled = true;
    });

    if (receiptStatus) {
      receiptStatus.hidden = false;
      receiptStatus.textContent = 'Please wait for approval...';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageViewer();
    closeReceiptModalFn();
  }
});


const profileBtn = document.getElementById('profileBtn');

if (profileBtn) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfvHZ68dW42k2GcpV890Nub8j10iruTRhKjmjI-crBHg_WvBg/viewform?usp=dialog', '_blank');
  });
}

const attendanceCard = document.getElementById('attendanceCard');
const mockupCard = document.getElementById('mockupCard');
const evaluationCard = document.getElementById('evaluationCard');

const openVideoPasswordBtn = document.getElementById('openVideoPasswordBtn');
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
const passwordDigits = Array.from(document.querySelectorAll('.password-digit'));
const passwordMessage = document.getElementById('passwordMessage');

const infoModal = document.getElementById('infoModal');
const infoModalTitle = document.getElementById('infoModalTitle');
const infoModalMessage = document.getElementById('infoModalMessage');
const closeInfoModal = document.getElementById('closeInfoModal');
const infoOkBtn = document.getElementById('infoOkBtn');

const videoModal = document.getElementById('videoModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const seminarVideoFrame = document.getElementById('seminarVideoFrame');

const SEMINAR_PASSWORD = '12345678';
const SEMINAR_VIDEO_URL = 'https://www.youtube.com/embed/UUNp7rnJZOM?start=39';
const EVALUATION_GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSe7snrj7v31p0HcMTGbIKNaytQbjkBkQ61b-YjXDUl2E_0Ajg/viewform?usp=header';

function openSimpleModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeSimpleModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function resetPasswordModal() {
  passwordDigits.forEach(input => {
    input.value = '';
    input.disabled = false;
  });

  if (verifyPasswordBtn) {
    verifyPasswordBtn.disabled = true;
    verifyPasswordBtn.textContent = 'VERIFY';
  }

  if (passwordMessage) {
    passwordMessage.hidden = true;
    passwordMessage.textContent = '';
  }
}

function updatePasswordButton() {
  const filled = passwordDigits.every(input => input.value.trim().length === 1);
  if (verifyPasswordBtn) verifyPasswordBtn.disabled = !filled;
}

function openPasswordModal() {
  resetPasswordModal();
  openSimpleModal(passwordModal);
  setTimeout(() => passwordDigits[0]?.focus(), 50);
}

function openInfoModal(title, message) {
  if (infoModalTitle) infoModalTitle.textContent = title;
  if (infoModalMessage) infoModalMessage.textContent = message;
  openSimpleModal(infoModal);
}

function openVideoModal() {
  if (seminarVideoFrame) {
    seminarVideoFrame.src = `${SEMINAR_VIDEO_URL}${SEMINAR_VIDEO_URL.includes('?') ? '&' : '?'}autoplay=1&rel=0`;
  }
  openSimpleModal(videoModal);
}

function closeVideoModalFn() {
  closeSimpleModal(videoModal);
  if (seminarVideoFrame) seminarVideoFrame.src = '';
}

if (openVideoPasswordBtn) {
  openVideoPasswordBtn.addEventListener('click', openPasswordModal);
}

if (closePasswordModal) {
  closePasswordModal.addEventListener('click', () => closeSimpleModal(passwordModal));
}

passwordDigits.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    e.target.value = digits.slice(0, 1);

    if (e.target.value && index < passwordDigits.length - 1) {
      passwordDigits[index + 1].focus();
    }

    updatePasswordButton();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      passwordDigits[index - 1].focus();
    }
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasted) return;

    pasted.split('').forEach((char, i) => {
      if (passwordDigits[index + i]) passwordDigits[index + i].value = char;
    });

    const nextIndex = Math.min(index + pasted.length, passwordDigits.length - 1);
    passwordDigits[nextIndex].focus();
    updatePasswordButton();
  });
});

if (verifyPasswordBtn) {
  verifyPasswordBtn.addEventListener('click', () => {
    const code = passwordDigits.map(input => input.value).join('');
    if (code !== SEMINAR_PASSWORD) {
      if (passwordMessage) {
        passwordMessage.hidden = false;
        passwordMessage.textContent = 'Incorrect password. Please ask assistant CARES office for password.';
      }
      return;
    }

    closeSimpleModal(passwordModal);
    openVideoModal();
  });
}

if (closeInfoModal) {
  closeInfoModal.addEventListener('click', () => closeSimpleModal(infoModal));
}

if (infoOkBtn) {
  infoOkBtn.addEventListener('click', () => closeSimpleModal(infoModal));
}

if (attendanceCard) {
  attendanceCard.addEventListener('click', () => {
    openInfoModal('Attendance', 'Please go to CARES office for verification of attendance.');
  });
}

if (mockupCard) {
  mockupCard.addEventListener('click', () => {
    openInfoModal('Mock-up Interview', 'You have already attended. Please finish all requirements to request certificate.');
  });
}

if (evaluationCard) {
  evaluationCard.addEventListener('click', () => {
    window.open(EVALUATION_GOOGLE_FORM_LINK, '_blank');
  });
}

if (closeVideoModal) {
  closeVideoModal.addEventListener('click', closeVideoModalFn);
}

if (videoModal) {
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModalFn();
  });
}

if (passwordModal) {
  passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) closeSimpleModal(passwordModal);
  });
}

if (infoModal) {
  infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) closeSimpleModal(infoModal);
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSimpleModal(passwordModal);
    closeSimpleModal(infoModal);
    closeVideoModalFn();
  }
});
