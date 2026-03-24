const createPlayer = (name, symbol) => {
    return { name, symbol };
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;

    const markCell = (index, symbol) => {
        if (board[index] === "") {
            board[index] = symbol;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, markCell, resetBoard };
})();

const gameController = (() => {
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");
    let currentPlayer = playerOne;
    let isGameOver = false;

    const switchTurns = () => {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    };

    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        const board = gameBoard.getBoard();

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                isGameOver = true;
                return true;
            }
        }    
        return false;
    };

    const checkTie = () => {
        if (!checkWin() && gameBoard.getBoard().every(cell => cell !== "")) {
            isGameOver = true;
            return true;
        }
        return false;
    };

    const playRound = (index) => {
        if (isGameOver) return;

        if (gameBoard.markCell(index, currentPlayer.symbol)) {
            displayController.renderBoard();
            if (checkWin()) {
                displayController.displayWinner();
            } else if (checkTie()) {
                displayController.displayTie();
            } else {
                switchTurns();
                displayController.displayPlayersTurn();
                gameFlowController.clickToPlay();
            }
        } else {
            alert("That space is already marked, pick another space!");
        }
    };
        

    const restartGame = () => {
        gameBoard.resetBoard();
        currentPlayer = playerOne;
        isGameOver = false;
        const winningPlayer = document.querySelector(".winning-player");
        winningPlayer.textContent = ""
        displayController.renderBoard();
        displayController.displayPlayersTurn();
        gameFlowController.clickToPlay();
    };

    return { playRound, restartGame, getCurrentPlayer: () => currentPlayer, getIsGameOver: () => isGameOver };
})();

const displayController = (() => {
    const renderBoard = () => {       
        const gameBoardContainer = document.querySelector(".game-board-container");
        gameBoardContainer.replaceChildren();
        const board = gameBoard.getBoard();
        board.forEach((cell, index) => {
            const newDiv = document.createElement("div");
            newDiv.classList.add("game-board-cell");
            newDiv.dataset.cell = `${index}`;
            newDiv.textContent = cell.toUpperCase();
            gameBoardContainer.appendChild(newDiv);
        });
    };

    const displayWinner = () => {
        const winningPlayer = document.querySelector(".winning-player");
        const playerObject = gameController.getCurrentPlayer();
        const currentPlayer = playerObject.name;
        const winnerMessage = `${currentPlayer} Wins!`;
        winningPlayer.textContent = winnerMessage;
    };

    const displayTie = () => {
        const winningPlayer = document.querySelector(".winning-player");
        winningPlayer.textContent = "It's a tie!"
    };

    const displayPlayersTurn = () => {
        const playersTurn = document.querySelector(".players-turn");
        const playerObject = gameController.getCurrentPlayer();
        const currentPlayer = playerObject.name;
        playersTurnMessage = `${currentPlayer}'s Turn.`;
        playersTurn.textContent = playersTurnMessage;
    };

    return { renderBoard, displayWinner, displayTie, displayPlayersTurn };
})();

const gameFlowController = (() => {
    const clickToPlay = () => {
        const boardCells = document.querySelectorAll("[data-cell]");
        boardCells.forEach(cell => {
            cell.addEventListener("click", (e) => {
                const index = e.target.dataset.cell;
                gameController.playRound(index);
            })
        });
    };
    
    return { clickToPlay };
})();

const resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", gameController.restartGame);

displayController.renderBoard();
displayController.displayPlayersTurn();
gameFlowController.clickToPlay();