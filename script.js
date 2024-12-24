let players = [];
let pot = 0;

// プレイヤー人数選択
function selectPlayers(numPlayers) {
  players = Array(numPlayers).fill(3000); // 初期チップを設定
  document.getElementById('player-selection-screen').style.display = 'none';
  document.getElementById('chip-management-screen').style.display = 'block';
  renderPlayers();
  updatePot();
}

// プレイヤーエリアを描画
function renderPlayers() {
  const container = document.getElementById('players-container');
  container.innerHTML = '';
  players.forEach((chips, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.innerHTML = `
      <h4>プレイヤー ${index + 1}</h4>
      <div>ベット額: <span id="bet-${index}">0</span></div>
      <div class="chip-stack" id="chip-stack-${index}"></div>
      <button onclick="bet(${index}, 100)">+100</button>
      <button onclick="bet(${index}, -100)">-100</button>
      <div>所持チップ: <span id="chips-${index}">${chips}</span></div>
      <button onclick="distributePot(${index})">ポットから分配</button>
    `;
    container.appendChild(playerDiv);
  });
}

// ベットの更新
function bet(playerIndex, amount) {
  const currentChips = players[playerIndex];
  const betSpan = document.getElementById(`bet-${playerIndex}`);
  const chipsSpan = document.getElementById(`chips-${playerIndex}`);
  let betAmount = parseInt(betSpan.textContent, 10);

  if (amount > 0 && currentChips >= amount) {
    players[playerIndex] -= amount;
    betAmount += amount;
  } else if (amount < 0 && betAmount >= Math.abs(amount)) {
    players[playerIndex] += Math.abs(amount);
    betAmount += amount;
  }

  chipsSpan.textContent = players[playerIndex];
  betSpan.textContent = betAmount;
  updatePot();
}

// ポットの更新
function updatePot() {
  pot = players.reduce((acc, _, index) => {
    return acc + parseInt(document.getElementById(`bet-${index}`).textContent, 10);
  }, 0);
  document.getElementById('pot-value').textContent = pot;
}

// ポットのチップを回収
function collectBets() {
  players.forEach((_, index) => {
    const betSpan = document.getElementById(`bet-${index}`);
    betSpan.textContent = '0';
  });
  updatePot();
}

// ポットから指定プレイヤーに全て分配
function distributePot(playerIndex) {
  players[playerIndex] += pot;
  pot = 0;
  renderPlayers();
  updatePot();
}
