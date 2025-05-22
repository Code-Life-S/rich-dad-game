// Player positions
let player1Position = 0;
let player2Position = 0;

// Current player (1 or 2)
let currentPlayer = 1;

// DOM elements
const gameBoard = document.getElementById('game-board');
const cells = gameBoard.children; // Assuming game-board only contains cell divs
const playerInfoDiv = document.getElementById('player-info');
const rollDieButton = document.getElementById('roll-die-button'); // Will be added to HTML

// Function to roll a die (1-6)
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to move a player
function movePlayer(player, roll) {
  // Clear previous player position styling
  if (player === 1) {
    if (cells[player1Position]) {
      cells[player1Position].classList.remove('player1');
    }
    player1Position += roll;
    if (player1Position >= 100) {
      player1Position = 99; // Cap at 99 (0-99 index)
    }
    if (cells[player1Position]) {
      cells[player1Position].classList.add('player1');
    }
  } else { // Player 2
    if (cells[player2Position]) {
      cells[player2Position].classList.remove('player2');
    }
    player2Position += roll;
    if (player2Position >= 100) {
      player2Position = 99; // Cap at 99
    }
    if (cells[player2Position]) {
      cells[player2Position].classList.add('player2');
    }
  }
}

// Function to switch turns
function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Function to update player info display
function updatePlayerInfo() {
  playerInfoDiv.innerHTML = `
    <p>Current Turn: Player ${currentPlayer}</p>
    <p>Player 1 Position: ${player1Position}</p>
    <p>Player 2 Position: ${player2Position}</p>
  `;
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  // Add button to HTML - this will be done in index.html directly for now
  // For now, assume button is in HTML, get reference
  const currentRollDieButton = document.getElementById('roll-die-button');

  if (currentRollDieButton) {
    currentRollDieButton.addEventListener('click', () => {
      const roll = rollDie();
      movePlayer(currentPlayer, roll);
      updatePlayerInfo();
      switchTurn();
    });
  } else {
    console.error("Roll Die Button not found!");
  }

  // Initial display
  if (cells[player1Position]) cells[player1Position].classList.add('player1'); // Mark P1 start
  // Player 2 starts at the same position, P1 will be overwritten if P2 is also 0.
  // This is fine for now, P2 will move on their turn.
  if (cells[player2Position] && player1Position !== player2Position) cells[player2Position].classList.add('player2');


  updatePlayerInfo();
});
