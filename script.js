const gameBoard = (function () {
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

  const getBoard = () => board;

  const placeMarker = function (marker, row, column) {
    if (board[row][column] === "") {
      board[row][column] = marker;
    }
  };

  return { getBoard, placeMarker }; //
})();

/*
 *****************************************************
 */

const gameController = function (playerOneName, playerTwoName) {
  const board = gameBoard;
  const boardArray = board.getBoard();
  // const boardValues = boardArray.flat();
  const removeBoardEventListeners = displayController.disableBoard;

  const players = [
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

  const playRound = (row, column) => {
    if (boardArray[row][column] !== "") {
      return;
    }

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
      removeBoardEventListeners();
    };

    const announceTie = function () {
      removeBoardEventListeners();
      openEndGameModal("Tie Game!");
    };

    const checkForFullBoard = function (boardValues) {
      if (boardValues.every((index) => index !== "")) {
        return true;
      } else return false;
    };

    function checkForWinningCombo(boardValues) {
      const endOfGame = winningCombos.some((combo) =>
        includesAll(boardValues, combo)
      );

      return { endOfGame };
    }

    const checkForEndOfGame = function () {
      const boardValues = boardArray.flat();

      const fullBoard = checkForFullBoard(boardValues);
      const winCombo = checkForWinningCombo(boardValues).endOfGame;

      if (fullBoard === false && winCombo === false) {
        switchPlayerTurn();
      } else if (fullBoard === false && winCombo === true) {
        announceWinner();
      } else if (fullBoard === true && winCombo === true) {
        announceWinner();
      } else if (fullBoard === true && winCombo === false) {
        announceTie();
      }
    };

    checkForEndOfGame();
  };

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

    const board = currentGameController.getBoard();
    const activePlayerName = currentGameController.getActivePlayer().name;
    const activePlayerMarker = currentGameController.getActivePlayer().marker;

    playerTurnDiv.innerText = ` ${activePlayerName}'s turn!`;

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
