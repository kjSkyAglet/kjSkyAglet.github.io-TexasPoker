let players = [];
let pot = 0;

// 初期画面の人数ボタン生成
const playerSelectScreen = document.getElementById('player-select-screen');
const chipManagementScreen = document.getElementById('chip-management-screen');
const mainTitle = document.getElementById('main-title');
const playerButtons = document.getElementById('player-buttons');

for (let i = 1; i <= 8; i++) {
  const button = document.createElement('button');
  button.textContent = `${i}人`; // ボタンに「1人」「2人」などを表示
  button.className = 'player-button';
  button.onclick = () => startGame(i);
  playerButtons.appendChild(button);
}

// ゲーム開始
function startGame(playerCount) {
  players = Array(playerCount).fill(1000); // 各プレイヤーの初期チップ数を設定
  renderPlayers();
  playerSelectScreen.classList.add('hidden');
  chipManagementScreen.classList.remove('hidden');
  mainTitle.classList.add('hidden'); // タイトルを非表示
}

// プレイヤー情報をレンダリング
function renderPlayers() {
  const container = document.getElementById('players-container');
  container.innerHTML = '';
  players.forEach((chips, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.innerHTML = `
      <h4>プレイヤー ${index + 1}</h4>
      <div>所持チップ: <span id="chips-${index}">${chips}</span></div>
      <div>ベット額: <span id="bet-${index}">0</span></div>
      <div class="chip-stack" id="chip-stack-${index}"></div>
      <button onclick="bet(${index}, 100)">+100</button>
      <button onclick="bet(${index}, -100)">-100</button>
      <button onclick="distributePotToPlayer(${index})">ポットから分配</button>
    `;
    container.appendChild(playerDiv);
  });
}

// ベットの処理
function bet(playerIndex, amount) {
  const currentChips = players[playerIndex];
  const betSpan = document.getElementById(`bet-${playerIndex}`);
  const chipsSpan = document.getElementById(`chips-${playerIndex}`);
  const chipStackDiv = document.getElementById(`chip-stack-${playerIndex}`);
  let betAmount = parseInt(betSpan.textContent, 10);

  if (amount > 0 && currentChips >= amount) {
    players[playerIndex] -= amount;
    betAmount += amount;
    addChipsToStack(chipStackDiv, betAmount / 100);
  } else if (amount < 0 && betAmount >= Math.abs(amount)) {
    players[playerIndex] += Math.abs(amount);
    betAmount += amount;
    addChipsToStack(chipStackDiv, betAmount / 100);
  }

  chipsSpan.textContent = players[playerIndex];
  betSpan.textContent = betAmount;
  updatePot();
}

// ベット額に応じてチップ画像を表示
function addChipsToStack(stackDiv, chipCount) {
  stackDiv.innerHTML = '';
  for (let i = 0; i < chipCount; i++) {
    const chip = document.createElement('img');
    chip.src = '/img/chip100.png';
    chip.className = 'chip';
    chip.style.bottom = `${i * 5}px`; // チップの重なり位置
    stackDiv.appendChild(chip);
  }
}

// ポットの更新
function updatePot() {
  pot = players.reduce((acc, _, index) => {
    return acc + parseInt(document.getElementById(`bet-${index}`).textContent, 10);
  }, 0);
  document.getElementById('pot-value').textContent = pot;
}

// ポットからプレイヤーごとに分配
function distributePotToPlayer(playerIndex) {
  const share = Math.floor(pot / players.length);
  players[playerIndex] += share;
  renderPlayers();
  resetPot();
}

// ポットのリセット
function resetPot() {
  pot = 0;
  document.getElementById('pot-value').textContent = pot;
  players.forEach((_, index) => {
    document.getElementById(`bet-${index}`).textContent = '0';
  });
}
