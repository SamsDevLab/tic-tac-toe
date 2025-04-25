/* 
Create two objects
1. Gameboard (IIFE)
2. Game Controller
3. displayContoller

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
  const removeBoardEventListeners = displayController.disableBoard;

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

  // const printNewRound = () => {
  //   board.printBoard();
  //   console.log(`${getActivePlayer().name}'s turn.`);
  // };

  const playRound = (row, column) => {
    if (boardArray[row][column] !== "") {
      // console.log("That square is already taken! Try again!");
      switchPlayerTurn();
    }
    // else
    //   console.log(
    //     `${getActivePlayer().name} places "${
    //       getActivePlayer().marker
    //     }" into row ${row}, column ${column}.`
    //   );

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

    const openEndGameModal = function (endGameMessage) {
      const endGameModal = document.querySelector(".end-game-modal");
      endGameModal.show();
      const finalMessage = document.querySelector(".final-message");
      finalMessage.innerText = endGameMessage;
    };

    const announceWinner = function () {
      openEndGameModal(`${getActivePlayer().name} WON!`);
    };

    const announceTie = function () {
      openEndGameModal("Tie Game!");
    };

    const checkForTie = function (boardValues) {
      if (boardValues.every((index) => index !== "")) {
        return true;
      }
    };

    function checkForWinner() {
      const boardValues = boardArray.flat();
      let endOfGame;

      winningCombos.forEach((combo) => {
        if (includesAll(boardValues, combo) === true) {
          announceWinner();
          removeBoardEventListeners();
          endOfGame = true;
        } else if (checkForTie(boardValues) === true) {
          announceTie();
          removeBoardEventListeners();
          endOfGame = true;
        }
      });

      return { endOfGame };
    }

    //Switch player turn
    if (checkForWinner().endOfGame === undefined) {
      switchPlayerTurn();
      // printNewRound();
    }
  };

  // Initial play game message
  // printNewRound();

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
  const playerTurnDiv = document.querySelector(".player-turn-container");
  let currentGameController;

  const openPlayerModal = function () {
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
    const activePlayerName = currentGameController.getActivePlayer().name;
    const activePlayerMarker = currentGameController.getActivePlayer().marker;
    // console.log(activePlayer);

    playerTurnDiv.innerText = ` ${activePlayerName}'s turn! (${activePlayerMarker})`;

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

  function clickHandlerBoard(e) {
    const columnValue = e.target.dataset.column;
    const row = e.target.closest(".row");
    const rowValue = row.dataset.row;

    // const selectedColumn = e.target.dataset.column;
    if (!columnValue) return;

    currentGameController.playRound(rowValue, columnValue);
    updateScreen();
  }

  const enableBoard = function () {
    boardDiv.addEventListener("click", clickHandlerBoard);
  };

  const disableBoard = function () {
    boardDiv.removeEventListener("click", clickHandlerBoard);
  };

  const resetBoard = function () {
    const endGameModal = document.querySelector(".end-game-modal");
    endGameModal.close();

    const board = currentGameController.getBoard();

    board.forEach((row) => row.forEach((cell, index) => (row[index] = "")));
    updateScreen();
    enableBoard();
  };

  const resetButton = document.querySelector(".reset-button");
  resetButton.addEventListener("click", resetBoard);

  openPlayerModal();
  enableBoard();

  return {
    disableBoard,
    playerTurnDiv,
  };
})();

/*
Features:


 Bugs:

 • Unsolved:
 Game Keeps Running
 --- ✅ Remove event listeners from board upon win or tie
 --- Display "win" or "tie" message in the player-turn-div
 --- Debug "tie" or "win" being called twice in a row (I have a hunch that this is happening due to my switchPlayerTurn hack. This hack basically re-called the player turn if the player was to click on a box which already had a value)


Reset Board Button
--- Reset board button needs to clear the board array and restart the game.
--- Do you want to force the users to choose new names?

Design Choices
--- May make X and O only show up in the modal when choosing a player name.
--- May remove from the game itself, we'll see
 


 • Solved:
 - ✅ Current player can overwrite previous player's value
  • ✅ Prevent program from switching player turns
  • ✅ Console.log a message saying "This cell has already been marked!"
 - ✅ Still switches player turn after win (This is just due to me manually calling switchActivePlayer and printNewRound. This shouldn't be an issue when interacting with the DOM)
 - ✅ Can still play the game after winner is declared (same as above - should be able to solve this with a modal popup/alert in the DOM)
 - ✅ Program logic to account for a tie (this may need to occur in checkForWinner() => winningCombos. Attempted this yesterday with the else if that is still there) 
 */
