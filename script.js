let players = [];
let pot = 0;
let betChip = []; // 各プレイヤーのベット額

// プレイヤー人数選択
function selectPlayers(numPlayers) {
  players = Array(numPlayers).fill(3000); // 初期チップ
  betChip = Array(numPlayers).fill(0); // ベットチップを初期化
  document.getElementById('player-selection-screen').style.display = 'none';
  document.getElementById('chip-management-screen').style.display = 'block';
  renderPlayers();
  updatePotDisplay();
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
      <div>ベット額: <span id="bet-${index}">${betChip[index]}</span></div>
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
  if (amount > 0 && currentChips >= amount) {
    players[playerIndex] -= amount;
    betChip[playerIndex] += amount;
  } else if (amount < 0 && betChip[playerIndex] >= Math.abs(amount)) {
    players[playerIndex] += Math.abs(amount);
    betChip[playerIndex] += amount; // amountは負数
  }
  renderPlayers();
}

// ポットの表示を更新
function updatePotDisplay() {
  document.getElementById('pot-value').textContent = pot;
}

function collectBets() {
    // すべてのプレイヤーのベット額が同じかどうかを確認
    const allBetsEqual = betChip.every(bet => bet === betChip[0]);
  
    if (allBetsEqual) {
      // ベット額がすべて同じ場合、ポットに回収
      betChip.forEach((amount, index) => {
        pot += amount;
        betChip[index] = 0; // 各プレイヤーのベット額をリセット
      });
      renderPlayers();
      updatePotDisplay();
    } 
  }

// ポットから指定プレイヤーに全て分配
function distributePot(playerIndex) {
  players[playerIndex] += pot;
  pot = 0; // ポットを空にする
  renderPlayers();
  updatePotDisplay();
}
