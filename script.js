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
Create two objects
1. Gameboard (IIFE)
2. Game Controller (IIFE)

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
  const placeMarker = function (marker, row, column) {
    board[row][column] = marker;
  };

  // Method used to print board to the console
  const printBoard = () => console.log(board);

  return { getBoard, placeMarker, printBoard };
})();

/*
 *****************************************************
 */

const gameController = function (playerOneName, playerTwoName) {
  const board = gameBoard;

  players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s marker into row ${row}, column ${column}.`
    );
    board.placeMarker(getActivePlayer().marker, row - 1, column - 1);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

    //Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
};

const competitors = gameController("STH", "ODB");
// competitors.playRound(1, 2);
// competitors.playRound(2, 1);
// competitors.playRound(1, 1);
// competitors.playRound(2, 2);
// competitors.playRound(2, 3);
// competitors.playRound(2, 3);

/* 

GAME CONTROLLER
• Determine player turn through "active" player
• Switch player turn
• Print new round to printBoard (this will announce whose turn it is)
• Actually play the round (log player's move and drop their marker on the board)
• Return playRound (for interaction with printBoard) and return activePlayer (this will be needed for UI)
*/
