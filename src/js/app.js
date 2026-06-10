const rulesBtn = document.getElementById('rules-btn');
const rulesOverlay = document.getElementById('rules-overlay');
const rulesClose = document.getElementById('rules-close');

function openRules() {
  rulesOverlay.classList.remove('hidden');
  rulesOverlay.focus();
}

function closeRules() {
  rulesOverlay.classList.add('hidden');
}

rulesBtn.addEventListener('click', openRules);
rulesClose.addEventListener('click', closeRules);

rulesOverlay.addEventListener('click', (e) => {
  if (e.target === rulesOverlay) closeRules();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !rulesOverlay.classList.contains('hidden')) {
    closeRules();
  }
});
