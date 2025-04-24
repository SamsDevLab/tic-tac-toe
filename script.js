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

  // Actual Game Board:
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
    if (boardArray[row][column] !== "") {
      console.log("That square is already taken! Try again!");
      switchPlayerTurn();
    } else
      console.log(
        `${getActivePlayer().name} places "${
          getActivePlayer().marker
        }" into row ${row}, column ${column}.`
      );

    board.placeMarker(getActivePlayer().marker, row, column);

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

    const includesAll = (boardValues, combo) =>
      combo.every((value) =>
        boardValues[value].includes(getActivePlayer().marker)
      );

    const announceWinner = function () {
      const winner = `${getActivePlayer().name} got three in a row! ${
        getActivePlayer().name
      } wins the game!`;

      console.log(winner);
    };

    const checkForTie = function (boardValues) {
      if (boardValues.every((index) => index !== "")) {
        return true;
      }
    };

    const announceTie = function () {
      const tieGame = "Tie Game!";
      console.log(tieGame);
    };

    function checkForWinner() {
      const boardValues = boardArray.flat();

      winningCombos.forEach((combo) => {
        if (includesAll(boardValues, combo) === true) {
          announceWinner();
        } else if (checkForTie(boardValues) === true) {
          announceTie();
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
    getBoard: board.getBoard,
  };
};

/*
 *****************************************************
 */

const displayController = (function () {
  const boardDiv = document.querySelector(".board-container");
  let currentGameController;

  const openModal = function () {
    const modal = document.querySelector(".player-modal");
    modal.showModal();

    const form = document.querySelector(".form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const playerOne = document.querySelector("#player-one").value;
      const playerTwo = document.querySelector("#player-two").value;

      currentGameController = gameController(playerOne, playerTwo);

      updateScreen();
      modal.close();
    });
  };

  const updateScreen = function () {
    const boardDiv = document.querySelector(".board-container");
    boardDiv.innerText = "";

    // Get newest version of board
    const board = currentGameController.getBoard();
    const activePlayer = currentGameController.getActivePlayer();

    // Display Player's Turn
    // playerTurnDiv.innerText =

    board.forEach((row, index) => {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      rowElement.dataset.row = index;
      boardDiv.appendChild(rowElement);

      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.innerText = cell;
        rowElement.appendChild(cellButton);
      });
    });
  };

  // Start here after dinner 04/23:
  // Commit the clickHandler and openModal functions. Check your git log to ensure you haven't already done this.
  // Create a display box for the competitors
  // Actively Switch the competitors from turn to turn
  function clickHandlerBoard(e) {
    const columnValue = e.target.dataset.column;
    const row = e.target.closest(".row");
    const rowValue = row.dataset.row;

    // const selectedColumn = e.target.dataset.column;
    if (!columnValue) return;

    currentGameController.playRound(rowValue, columnValue);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  openModal();
})();

/*
Features:

• Modal is working. However, gameContoller is being called from displayController BEFORE modal can even be filled out.
••• This is causing two "undefined" values to pass into the gameController from the beginning, when it should be the user names.
••• May have to step through the code and assess how to call the gameController separately (after the inital name values have been passed in)


 Bugs:

 • Unsolved:
 


 • Solved:
 - ✅ Current player can overwrite previous player's value
  • ✅ Prevent program from switching player turns
  • ✅ Console.log a message saying "This cell has already been marked!"
 - ✅ Still switches player turn after win (This is just due to me manually calling switchActivePlayer and printNewRound. This shouldn't be an issue when interacting with the DOM)
 - ✅ Can still play the game after winner is declared (same as above - should be able to solve this with a modal popup/alert in the DOM)
 - ✅ Program logic to account for a tie (this may need to occur in checkForWinner() => winningCombos. Attempted this yesterday with the else if that is still there) 
 */
