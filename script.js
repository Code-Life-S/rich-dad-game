// Constants for Game Logic
const STARTING_MONEY = 5000;
const WINNING_AMOUNT = 100000; // This might need adjustment later for a shorter game
const LOSING_THRESHOLD = 0;
const TOTAL_CELLS = 24; // New constant for total cells

// Player positions
let player1Position = 0;
let player2Position = 0;

// Player money
let player1Money = STARTING_MONEY;
let player2Money = STARTING_MONEY;

// Current player (1 or 2)
let currentPlayer = 1;

// Player Icons
let player1Icon;
let player2Icon;

// DOM elements
const gameBoard = document.getElementById('game-board');
const cells = gameBoard.children; // Assuming game-board only contains cell divs
const playerInfoDiv = document.getElementById('player-info');
let eventLogDiv; // Will be assigned in DOMContentLoaded
let rollDieButton; // Will be assigned in DOMContentLoaded

// Function to log events
function logEvent(message) {
  if (!eventLogDiv) {
    eventLogDiv = document.getElementById('event-log');
    if (!eventLogDiv) {
      console.error("Event log div not found!");
      return;
    }
  }
  const newMessage = document.createElement('p');
  newMessage.textContent = message;
  eventLogDiv.appendChild(newMessage);
  eventLogDiv.scrollTop = eventLogDiv.scrollHeight; // Scroll to bottom
}

// Function to roll a die (1-6)
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to move a player
function movePlayer(player, roll) {
  let targetPosition;
  let iconToMove;

  if (player === 1) {
    player1Position = (player1Position + roll) % TOTAL_CELLS; // Use TOTAL_CELLS
    targetPosition = player1Position;
    iconToMove = player1Icon;
  } else { // Player 2
    player2Position = (player2Position + roll) % TOTAL_CELLS; // Use TOTAL_CELLS
    targetPosition = player2Position;
    iconToMove = player2Icon;
  }

  if (cells[targetPosition] && iconToMove) {
    cells[targetPosition].appendChild(iconToMove);
  }
}

// Helper function to get tile type based on cell index
function getTileType(cellIndex) {
  const greenTiles = [0, 1, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23];
  const orangeTiles = [2, 7, 12, 17];
  const purpleTiles = [3, 8, 13, 18];
  const blueTiles = [4, 9, 14];
  const redTiles = [19]; // Corrected to be an array

  if (greenTiles.includes(cellIndex)) return "green";
  if (orangeTiles.includes(cellIndex)) return "orange";
  if (purpleTiles.includes(cellIndex)) return "purple";
  if (blueTiles.includes(cellIndex)) return "blue";
  if (redTiles.includes(cellIndex)) return "red";
  
  console.warn(`Unknown tile type for cellIndex: ${cellIndex}`); // Log a warning
  return "unknown"; 
}

// Function to handle cell actions
function handleCellAction(player, cellIndex) {
  const tileType = getTileType(cellIndex);
  let eventMessage = `Player ${player} landed on cell ${cellIndex} (${tileType}). `;

  switch (tileType) {
    case "green":
      const greenTileMoney = 100;
      if (player === 1) {
        player1Money += greenTileMoney;
      } else {
        player2Money += greenTileMoney;
      }
      eventMessage += `Gained $${greenTileMoney} for cooperation.`;
      break;
    case "orange":
      eventMessage += `An event occurs! (Details TBD)`;
      break;
    case "purple":
      eventMessage += `Faced with a dilemma! (Details TBD)`;
      break;
    case "blue":
      const blueTileMoney = 250;
      const gainMoney = Math.random() < 0.5; // 50% chance
      if (gainMoney) {
        if (player === 1) {
          player1Money += blueTileMoney;
        } else {
          player2Money += blueTileMoney;
        }
        eventMessage += `Financial luck! Gained $${blueTileMoney}.`;
      } else {
        if (player === 1) {
          player1Money -= blueTileMoney;
        } else {
          player2Money -= blueTileMoney;
        }
        eventMessage += `Financial setback! Lost $${blueTileMoney}.`;
      }
      break;
    case "red":
      eventMessage += `A special challenge! (Details TBD)`;
      break;
    default: // Should not be reached if getTileType is correct
      eventMessage += `Unknown tile type. No action.`;
      console.warn(`Unhandled tile type: ${tileType} for cellIndex: ${cellIndex}`);
      break;
  }
  logEvent(eventMessage);
}

// Function to switch turns
function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  logEvent(`Player ${currentPlayer}'s turn.`); // Log turn change
}

// Function to check for win/loss conditions
function checkWinLossConditions(player) {
  const money = (player === 1) ? player1Money : player2Money;

  if (money <= LOSING_THRESHOLD) {
    logEvent(`Player ${player} has $${money}. Player ${player} is out of money and loses!`);
    if (rollDieButton) rollDieButton.disabled = true;
    logEvent("Game Over!");
    return true; // Game ended
  }

  if (money >= WINNING_AMOUNT) {
    logEvent(`Player ${player} has reached $${money}! Player ${player} WINS THE GAME!`);
    if (rollDieButton) rollDieButton.disabled = true;
    logEvent("Congratulations!");
    return true; // Game ended
  }

  return false; // Game continues
}

// Function to update player info display
function updatePlayerInfo() {
  playerInfoDiv.innerHTML = `
    <p>Current Turn: Player ${currentPlayer}</p>
    <p>Player 1: Cell ${player1Position} - $${player1Money}</p>
    <p>Player 2: Cell ${player2Position} - $${player2Money}</p>
  `;
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  eventLogDiv = document.getElementById('event-log');
  rollDieButton = document.getElementById('roll-die-button'); // Assign global button reference

  if (rollDieButton) {
    rollDieButton.disabled = false; // Ensure button is enabled at start
  }

  // Create player icons
  player1Icon = document.createElement('div');
  player1Icon.id = 'player1-icon';
  player1Icon.classList.add('player-icon', 'p1-icon');
  player1Icon.textContent = "🚁"; // Player 1 emoji

  player2Icon = document.createElement('div');
  player2Icon.id = 'player2-icon';
  player2Icon.classList.add('player-icon', 'p2-icon');
  player2Icon.textContent = "🏎️"; // Player 2 emoji

  // Place icons at the start
  if (cells[player1Position]) {
    cells[player1Position].appendChild(player1Icon);
  }
  if (cells[player2Position]) { // If P2 starts at a different spot, otherwise will be on same cell
    cells[player2Position].appendChild(player2Icon);
  }

  // The global rollDieButton is already assigned by line 143:
  // rollDieButton = document.getElementById('roll-die-button');
  // So, we use that variable directly here.
  // The const rollDieButton = ... line that was here previously has been removed.

  if (rollDieButton) { // This now correctly refers to the global rollDieButton, assigned on line 143.
    rollDieButton.addEventListener('click', () => {
      const roll = rollDie();
      
      movePlayer(currentPlayer, roll); // This updates playerXPosition

      const newPosition = currentPlayer === 1 ? player1Position : player2Position;
      handleCellAction(currentPlayer, newPosition); // Handle action for the new cell

      updatePlayerInfo(); // Update money and position

      const gameEnded = checkWinLossConditions(currentPlayer);

      if (!gameEnded) {
        switchTurn();
      }
    });
  } else {
    console.error("Roll Die Button not found!");
  }

  updatePlayerInfo(); // Initial info display (money and positions)
  logEvent("Game started. Player 1's turn."); // Initial event log
});
