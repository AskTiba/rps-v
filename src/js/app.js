const rulesBtn = document.getElementById('rules-btn');
const rulesOverlay = document.getElementById('rules-overlay');
const rulesClose = document.getElementById('rules-close');
const rulesImage = document.getElementById('rules-image');
const modeToggle = document.getElementById('mode-toggle');
const logoImg = document.getElementById('logo-img');
const logoContainer = document.getElementById('logo-container');
const choicesEl = document.getElementById('choices');
const revealSection = document.getElementById('reveal');
const userChoiceContainer = document.getElementById('user-choice');
const houseChoiceContainer = document.getElementById('house-choice');
const resultDisplay = document.getElementById('result-display');
const resultText = document.getElementById('result-text');
const playAgainBtn = document.getElementById('play-again');
const scoreElement = document.getElementById('score');
const gameEl = document.querySelector('.game');

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

const CHOICE_CONFIG = {
  paper:     { className: 'choice--paper',     icon: 'assets/images/icon-paper.svg',     label: 'Paper' },
  scissors:  { className: 'choice--scissors',  icon: 'assets/images/icon-scissors.svg',  label: 'Scissors' },
  rock:      { className: 'choice--rock',      icon: 'assets/images/icon-rock.svg',      label: 'Rock' },
  lizard:    { className: 'choice--lizard',    icon: 'assets/images/icon-lizard.svg',    label: 'Lizard' },
  spock:     { className: 'choice--spock',     icon: 'assets/images/icon-spock.svg',     label: 'Spock' },
};

const MODES = {
  original: {
    moves: ['paper', 'scissors', 'rock'],
    rules: { paper: ['rock'], rock: ['scissors'], scissors: ['paper'] },
    bg: 'assets/images/bg-triangle.svg',
    logo: 'assets/images/logo.svg',
    rulesImg: 'assets/images/image-rules.svg',
    ariaLabel: 'Rock Paper Scissors',
    storageKey: 'rps-score',
    modeBtnText: 'BONUS',
  },
  bonus: {
    moves: ['scissors', 'paper', 'rock', 'lizard', 'spock'],
    rules: {
      scissors: ['paper', 'lizard'],
      paper: ['rock', 'spock'],
      rock: ['lizard', 'scissors'],
      lizard: ['spock', 'paper'],
      spock: ['scissors', 'rock'],
    },
    bg: 'assets/images/bg-pentagon.svg',
    logo: 'assets/images/logo-bonus.svg',
    rulesImg: 'assets/images/image-rules-bonus.svg',
    ariaLabel: 'Rock Paper Scissors Lizard Spock',
    storageKey: 'rpsls-score',
    modeBtnText: 'CLASSIC',
  },
};

const MESSAGES = { win: 'You Win', lose: 'You Lose', draw: 'Draw' };

let currentMode = 'original';
let isPlaying = false;
let houseTimeout = null;
let resultTimeout = null;
let score = 0;

function loadScore() {
  score = parseInt(localStorage.getItem(MODES[currentMode].storageKey) || '0', 10);
  scoreElement.textContent = score;
}

function saveScore() {
  localStorage.setItem(MODES[currentMode].storageKey, String(score));
}

function renderChoices() {
  const mode = MODES[currentMode];
  choicesEl.classList.toggle('choices--pentagon', currentMode === 'bonus');

  choicesEl.innerHTML = '';

  const bg = document.createElement('img');
  bg.className = 'choices__triangle';
  bg.src = mode.bg;
  bg.alt = '';
  bg.setAttribute('aria-hidden', 'true');
  choicesEl.appendChild(bg);

  for (const move of mode.moves) {
    const config = CHOICE_CONFIG[move];
    const btn = document.createElement('button');
    btn.className = `choice ${config.className}`;
    btn.dataset.move = move;
    btn.setAttribute('aria-label', config.label);
    btn.addEventListener('click', () => playRound(move));

    const icon = document.createElement('span');
    icon.className = 'choice__icon';

    const img = document.createElement('img');
    img.src = config.icon;
    img.alt = config.label;
    img.draggable = false;

    icon.appendChild(img);
    btn.appendChild(icon);
    choicesEl.appendChild(btn);
  }
}

function setupMode() {
  const mode = MODES[currentMode];
  gameEl.classList.toggle('game--bonus', currentMode === 'bonus');
  modeToggle.textContent = mode.modeBtnText;
  logoImg.src = mode.logo;
  logoContainer.setAttribute('aria-label', mode.ariaLabel);
  rulesImage.src = mode.rulesImg;
  renderChoices();
  loadScore();
}

function toggleMode() {
  if (isPlaying) return;
  currentMode = currentMode === 'original' ? 'bonus' : 'original';
  setupMode();
}

modeToggle.addEventListener('click', toggleMode);

function createChoiceCircle(move) {
  const config = CHOICE_CONFIG[move];
  const div = document.createElement('div');
  div.className = `choice ${config.className}`;
  div.style.cursor = 'default';
  const icon = document.createElement('span');
  icon.className = 'choice__icon';
  const img = document.createElement('img');
  img.src = config.icon;
  img.alt = config.label;
  img.draggable = false;
  icon.appendChild(img);
  div.appendChild(icon);
  return div;
}

function getRandomMove() {
  const moves = MODES[currentMode].moves;
  return moves[Math.floor(Math.random() * moves.length)];
}

function getResult(player, house) {
  const rules = MODES[currentMode].rules;
  if (player === house) return 'draw';
  if (rules[player].includes(house)) return 'win';
  return 'lose';
}

function updateScore(result) {
  if (result === 'win') score++;
  if (result === 'lose') score = Math.max(0, score - 1);
  scoreElement.textContent = score;
  saveScore();
}

function playRound(playerMove) {
  if (isPlaying) return;
  isPlaying = true;

  choicesEl.classList.add('hidden');
  revealSection.classList.remove('hidden');

  requestAnimationFrame(() => {
    const revealH = revealSection.offsetHeight;
    revealSection.style.top = `${revealH / 2 - 204}px`;
  });

  userChoiceContainer.appendChild(createChoiceCircle(playerMove));
  houseChoiceContainer.classList.add('reveal__choice--loading');

  houseTimeout = setTimeout(() => {
    houseChoiceContainer.classList.remove('reveal__choice--loading');
    const houseMove = getRandomMove();
    houseChoiceContainer.appendChild(createChoiceCircle(houseMove));

    const result = getResult(playerMove, houseMove);

    resultTimeout = setTimeout(() => {
      resultText.textContent = MESSAGES[result];
      resultDisplay.classList.add('show');

      requestAnimationFrame(() => {
        const revealH = revealSection.offsetHeight;
        revealSection.style.top = `${revealH / 2 - 204}px`;

        revealSection.offsetHeight;

        const labels = revealSection.querySelectorAll('.reveal__label');
        const lastLabel = labels[labels.length - 1];
        const labelsBottom = lastLabel.getBoundingClientRect().bottom;
        const rulesTop = rulesBtn.getBoundingClientRect().top;
        const space = rulesTop - labelsBottom - 32;
        const contentHeight = resultDisplay.scrollHeight;

        if (space > contentHeight) {
          const padding = (space - contentHeight) / 2;
          resultDisplay.style.paddingTop = `${padding}px`;
          resultDisplay.style.paddingBottom = `${padding}px`;
        }

        revealSection.offsetHeight;
        const revealH2 = revealSection.offsetHeight;
        revealSection.style.top = `${revealH2 / 2 - 204}px`;
      });

      updateScore(result);
      resultTimeout = null;
    }, 3000);

    houseTimeout = null;
  }, 1500);
}

function resetGame() {
  if (houseTimeout) {
    clearTimeout(houseTimeout);
    houseTimeout = null;
  }
  if (resultTimeout) {
    clearTimeout(resultTimeout);
    resultTimeout = null;
  }
  isPlaying = false;
  choicesEl.classList.remove('hidden');
  revealSection.classList.add('hidden');
  revealSection.style.top = '';
  resultDisplay.style.paddingTop = '';
  resultDisplay.style.paddingBottom = '';
  userChoiceContainer.innerHTML = '';
  houseChoiceContainer.innerHTML = '';
  resultDisplay.classList.remove('show');
}

playAgainBtn.addEventListener('click', resetGame);

setupMode();
