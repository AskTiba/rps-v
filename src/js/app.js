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

const choiceBtns = document.querySelectorAll('.choice[data-move]');
const choicesSection = document.getElementById('choices');
const revealSection = document.getElementById('reveal');
const userChoiceContainer = document.getElementById('user-choice');
const houseChoiceContainer = document.getElementById('house-choice');
const resultDisplay = document.getElementById('result-display');
const resultText = document.getElementById('result-text');
const playAgainBtn = document.getElementById('play-again');
const scoreElement = document.getElementById('score');

const CHOICE_CONFIG = {
  paper: {
    className: 'choice--paper',
    icon: 'assets/images/icon-paper.svg',
    label: 'Paper',
  },
  scissors: {
    className: 'choice--scissors',
    icon: 'assets/images/icon-scissors.svg',
    label: 'Scissors',
  },
  rock: {
    className: 'choice--rock',
    icon: 'assets/images/icon-rock.svg',
    label: 'Rock',
  },
};

const MOVES = ['paper', 'scissors', 'rock'];
const RULES = { paper: 'rock', rock: 'scissors', scissors: 'paper' };
const MESSAGES = { win: 'You Win', lose: 'You Lose', draw: 'Draw' };

let isPlaying = false;
let houseTimeout = null;
let resultTimeout = null;
let score = parseInt(localStorage.getItem('rps-score') || '0', 10);
scoreElement.textContent = score;

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
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function getResult(player, house) {
  if (player === house) return 'draw';
  if (RULES[player] === house) return 'win';
  return 'lose';
}

function updateScore(result) {
  if (result === 'win') score++;
  if (result === 'lose') score = Math.max(0, score - 1);
  scoreElement.textContent = score;
  localStorage.setItem('rps-score', String(score));
}

function playRound(playerMove) {
  if (isPlaying) return;
  isPlaying = true;

  choicesSection.classList.add('hidden');
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
  choicesSection.classList.remove('hidden');
  revealSection.classList.add('hidden');
  revealSection.style.top = '';
  resultDisplay.style.paddingTop = '';
  resultDisplay.style.paddingBottom = '';
  userChoiceContainer.innerHTML = '';
  houseChoiceContainer.innerHTML = '';
  resultDisplay.classList.remove('show');
}

choiceBtns.forEach((btn) => {
  btn.addEventListener('click', () => playRound(btn.dataset.move));
});

playAgainBtn.addEventListener('click', resetGame);
