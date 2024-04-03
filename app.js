let modeSelect = document.querySelector("#mode");
let startBtn = document.querySelector("#start-btn");
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let singlePlayerMode = true; // Default mode is single player
let currentPlayer = "X"; // For two players game
let gameOver = false;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    currentPlayer = "X";
    gameOver = false;
    enableBoxes();
    msgContainer.classList.add("hide");
}

const switchPlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    gameOver = true;
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val == pos2Val && pos2Val == pos3Val) {
                showWinner(pos1Val);
                return;
            }
        }
    }
    // Check for a draw
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a draw!";
        msgContainer.classList.remove("hide");
        gameOver = true;
    }
};

const playComputerMove = () => {
    if (gameOver) return;
    // Simplest AI: Just randomly choose an empty box
    let emptyBoxes = [...boxes].filter(box => box.innerText === "");
    if (emptyBoxes.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
        emptyBoxes[randomIndex].innerText = "O";
        switchPlayer();
        checkWinner();
    }
}

const playerVsComputerMove = (event) => {
    let box = event.target;
    if (box.innerText === "" && currentPlayer === "X" && !gameOver) {
        box.innerText = currentPlayer;
        switchPlayer();
        checkWinner();
        if (!gameOver) {
            playComputerMove(); // Computer makes its move after player's move
        }
    }
};

const twoPlayersMove = (event) => {
    let box = event.target;
    if (box.innerText === "" && !gameOver) {
        box.innerText = currentPlayer;
        checkWinner();
        if (!gameOver) {
            switchPlayer();
        }
    }
};

startBtn.addEventListener("click", () => {
    singlePlayerMode = modeSelect.value === "1";
    resetGame(); // Reset the game regardless of mode

    if (singlePlayerMode) {
        // Player vs Computer logic
        boxes.forEach((box) => {
            box.addEventListener("click", playerVsComputerMove);
        });
    } else {
        // Two players logic
        boxes.forEach((box) => {
            box.addEventListener("click", twoPlayersMove);
        });
    }
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
