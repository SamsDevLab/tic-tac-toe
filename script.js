/* 
Tic Tac Toe
• Two Players
• One player's "marker" is "X", the other is "O"
• "X" (playerOne) goes first
• Turns alternate between players
• Placing a marker signifies the end of the turn - turn will then switch to alt player
• Once someone places three markers in a row (whether diagonal, vertical, or horizontal), they win the game - will need to print message accordingly
*/

/* 
Create three objects
1. Gameboard (IIFE)
2. Player
3. Game Controller (IIFE)

For single instances of objects, wrap your objects in IIFEs so they cannot be re-instantiated
Functionality should fit in one of these three module patterns
*/

/* 
GAME BOARD
• IIFE as it only needs one instance 
• Composes structure of board
• Returns board so it can interact with DOM and gameController
• Takes in players object and places the players marker on board
• Prints board to console (while not exposing board itself)
*/

const gameBoard = (function () {
  // Create board
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      const cell = "";
      board[i].push(cell);
    }
  }

  // Method used to grab board as a whole to interact with the DOM
  const getBoard = () => board;

  // Interact with board to place marker
  const placeMarker = function (marker, outerIndex, innerIndex) {
    board[outerIndex][innerIndex] = marker;
  };

  // Method used to print board to the console
  const printBoard = () => console.log(board);

  return { getBoard, placeMarker, printBoard };
})();

console.log(gameBoard.printBoard());
/*
PLAYER
• Pass name argruments through parameters ✅
• Store player names in objects ✅
• Assign their markers (X or O) ✅
• Return players so they can interact with gameController and gameBoard
*/

// Start here tomorrow 04/10 - try to return getPlayers();
// const assignPlayers = function (playerOneName, playerTwoName) {
//   const players = [
//     {
//       name: playerOneName,
//       marker: "X",
//     },
//     {
//       name: playerTwoName,
//       marker: "O",
//     },
//   ];

//   const getPlayers = () => players;

//   return { getPlayers };
// };

// const result = assignPlayers("Sammy D", "Ol' Dirty Bastard");
// console.log(result.getPlayers());

/* 
GAME CONTROLLER
• Determine player turn through "active" player
• Switch player turn
• Print new round to printBoard (this will announce whose turn it is)
• Actually play the round (log player's move and drop their marker on the board)
• Return playRound (for interaction with printBoard) and return activePlayer (this will be needed for UI)
*/
// const gameController = function () {
//   const players = assignPlayers();
//   console.log(players);
// };
