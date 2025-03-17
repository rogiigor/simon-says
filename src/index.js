/**
 * DOM SELECTORS
 */

 const startButton = document.querySelector(".js-start-button");
 const statusSpan = document.querySelector(".js-status");
 const heading = document.querySelector(".js-heading"); 
 const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far

/**
 *
 * The `pads` array contains an array of pad objects.
 *
 */

 const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("https://github.com/rogiigor/simon-says/blob/main/assets/simon-says-sound-1.mp3?raw=true"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("https://github.com/rogiigor/simon-says/blob/main/assets/simon-says-sound-2.mp3?raw=true"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("https://github.com/rogiigor/simon-says/blob/main/assets/simon-says-sound-3.mp3?raw=true"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("https://github.com/rogiigor/simon-says/blob/main/assets/simon-says-sound-4.mp3?raw=true"),
  }
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

/**
 * Called when the start button is clicked.
 *
 */
function startButtonHandler() {
  maxRoundCount = setLevel();
  roundCount++;
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();
  return { startButton, statusSpan };
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  let pad = pads.find((pad) => pad.color === color );
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */

function setLevel(level = 1) {
  if (!level || level === null) return 8;
  switch(level) {
    case 1:
      return 8;
      break;
    case 2:
      return 14;
      break;
    case 3:
      return 20;
      break;
    case 4:
      return 31;
      break;
    default:
      return "Please enter level 1, 2, 3, or 4";
  }
}

/**
 * Returns a randomly selected item from a given array.
 *
 */
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

/**
 * Sets the status text of a given HTML element with a given a message
 */
function setText(element, text) {
  element.textContent = text;
  return element;
}

/**
 * Activates a pad of a given color by playing its sound and light
 */
function activatePad(color) {
  let pad = pads.find((pad) => pad.color === color); // #1
  const padSelector = pad.selector;
  padSelector.classList.add("activated"); // #2
  pad.sound.play(); // #3
  setTimeout(() => {
    padSelector.classList.remove("activated");
  }, 500);
}

/**
 * Activates a sequence of colors passed as an array to the function
 */
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, (index + 1) * 600);
  })
}

/**
 * Allows the computer to play its turn.
 */
 function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading,`Round ${roundCount} of ${maxRoundCount}`);
  const sequence = ["red", "blue", "green", "yellow"];
  let randomColor = getRandomItem(sequence);
  computerSequence.push(randomColor); // #4
  activatePads(computerSequence); // #5
  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000); // 5
}

/**
 * Allows the player to play their turn.
 */
function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  let numberOfPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Player: ${numberOfPresses} number of presses left`);
}

/**
 * Checks the player's selection every time the player presses on a pad during
 * the player's turn
 */
function checkPress(color) {
  playerSequence.push(color);
  let index = playerSequence.indexOf(color);
  let remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan.textContent, `Player turn: ${remainingPresses} presses left`);
  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Better luck next time");
    return;
  }
  if (remainingPresses === 0) {
    checkRound();
  }
}

/**
 * Checks each round to see if the player has completed all the rounds of the game * or advance to the next round if the game has not finished.
 */
function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    setText(statusSpan, "You completed all your turns");
    resetGame("Good Job. You are done");
  } else {
    roundCount++;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(playComputerTurn, 1000);
  }
}

/**
 * Resets the game. Called when either the player makes a mistake or wins the game.
 */
function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");

  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
