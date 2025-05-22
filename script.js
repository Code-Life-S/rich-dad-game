// Constants for Actions & Money
const PAYCHECK_AMOUNT = 500;
const LUCKY_EVENT_AMOUNT = 200;
const EXPENSE_AMOUNT = 100;
const TAX_AMOUNT = 150;
const STARTING_MONEY = 5000;
const WINNING_AMOUNT = 100000;
const LOSING_THRESHOLD = 0;

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
    player1Position = (player1Position + roll) % 100; // Wrap around
    targetPosition = player1Position;
    iconToMove = player1Icon;
  } else { // Player 2
    player2Position = (player2Position + roll) % 100; // Wrap around
    targetPosition = player2Position;
    iconToMove = player2Icon;
  }

  if (cells[targetPosition] && iconToMove) {
    cells[targetPosition].appendChild(iconToMove);
  }
}

// Function to handle cell actions
function handleCellAction(player, cellIndex) {
  const actionType = cellIndex % 5;
  let message = `Player ${player} landed on cell ${cellIndex}. `;

  switch (actionType) {
    case 0: // Green: Paycheck
      if (player === 1) player1Money += PAYCHECK_AMOUNT;
      else player2Money += PAYCHECK_AMOUNT;
      message += `It's a Paycheck! +$${PAYCHECK_AMOUNT}.`;
      break;
    case 1: // Blue: Investment
      message += `It's an Investment Opportunity. (No change in money yet).`;
      break;
    case 2: // Orange: Lucky Event
      if (player === 1) player1Money += LUCKY_EVENT_AMOUNT;
      else player2Money += LUCKY_EVENT_AMOUNT;
      message += `Lucky Event! +$${LUCKY_EVENT_AMOUNT}.`;
      break;
    case 3: // Red: Expense
      if (player === 1) player1Money -= EXPENSE_AMOUNT;
      else player2Money -= EXPENSE_AMOUNT;
      message += `Oh no, an Expense! -$${EXPENSE_AMOUNT}.`;
      break;
    case 4: // Purple: Tax
      if (player === 1) player1Money -= TAX_AMOUNT;
      else player2Money -= TAX_AMOUNT;
      message += `Tax time! -$${TAX_AMOUNT}.`;
      break;
    default:
      message += `No special action.`;
  }
  logEvent(message);
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

  player2Icon = document.createElement('div');
  player2Icon.id = 'player2-icon';
  player2Icon.classList.add('player-icon', 'p2-icon');

  // Place icons at the start
  if (cells[player1Position]) {
    cells[player1Position].appendChild(player1Icon);
  }
  if (cells[player2Position]) { // If P2 starts at a different spot, otherwise will be on same cell
    cells[player2Position].appendChild(player2Icon);
  }

  const rollDieButton = document.getElementById('roll-die-button');

  if (rollDieButton) {
    rollDieButton.addEventListener('click', () => {
      const roll = rollDie();
      // const currentPositionBeforeMove = currentPlayer === 1 ? player1Position : player2Position; // Not strictly needed now
      
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
