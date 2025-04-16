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
      `${getActivePlayer().name} places "${
        getActivePlayer().marker
      }" into row ${row}, column ${column}.`
    );
    board.placeMarker(getActivePlayer().marker, row - 1, column - 1);

    /****************
    Winning the Game 
    ****************/
    const winningCombos = [
      // Across (L or R):
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      // Down or Up
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      // Diagonal
      [0, 4, 8],
      [2, 4, 6],
    ];

    const includesAll = (boardArr, winningCombo) =>
      winningCombo.every((value) =>
        boardArr[value].includes(getActivePlayer().marker)
      );

    function checkForWinner() {
      const boardValues = board.getBoard().flat();

      function announceWinner() {
        console.log(
          `${getActivePlayer().name} got three in a row! ${
            getActivePlayer().name
          } wins the game!`
        );
      }
      winningCombos.forEach((comboValues) => {
        if (includesAll(boardValues, comboValues) === true) {
          announceWinner();
        }
      });
    }

    //Switch player turn
    checkForWinner();
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
competitors.playRound(1, 1);
competitors.playRound(2, 2);
competitors.playRound(1, 2);
competitors.playRound(3, 1);
competitors.playRound(3, 2);
competitors.playRound(1, 3);
