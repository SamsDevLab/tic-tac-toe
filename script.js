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
    if (board[row][column] === "") {
      board[row][column] = marker;
    }
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
  const boardArray = board.getBoard();

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
    if (boardArray[row - 1][column - 1] !== "") {
      console.log("That square is already taken! Try again!");
      switchPlayerTurn();
    } else
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

    const includesAll = (boardValues, comboValues) =>
      comboValues.every((value) =>
        boardValues[value].includes(getActivePlayer().marker)
      );

    const announceWinner = function () {
      const winner = `${getActivePlayer().name} got three in a row! ${
        getActivePlayer().name
      } wins the game!`;

      console.log(winner);
    };

    function checkForWinner() {
      const boardValues = boardArray.flat();

      winningCombos.forEach((comboValues) => {
        if (includesAll(boardValues, comboValues) === true) {
          announceWinner();
        }
      });
    }

    // console.log(winner);
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
competitors.playRound(2, 1);
competitors.playRound(1, 2);
competitors.playRound(2, 2);
competitors.playRound(1, 3);
competitors.playRound(2, 2);
competitors.playRound(2, 1);
competitors.playRound(3, 2);

/*
 Bugs and Features to Work on After Lunch:

 Bugs:
 - ✅ Current player can overwrite previous player's value
  • ✅ Prevent program from switching player turns
  • ✅ Console.log a message saying "This cell has already been marked!"
 - Still switches player turn after win 
 - Can still play the game after winner is declared
 */
