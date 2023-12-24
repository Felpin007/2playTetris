const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('game2');
const ctx2 = canvas2.getContext('2d');
const blockSize = 30;
let score = 0;
let score2 = 0;
let timer = 60;

const board = new Array(20);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(10).fill(0);
}

const board2 = new Array(20);
for (let i = 0; i < board2.length; i++) {
  board2[i] = new Array(10).fill(0);
}

let currentPiece;
let currentX;
let currentY;

let currentPiece2;
let currentX2;
let currentY2;

const pieces = [
    [
      [1, 1, 1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 1],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 1]
    ]
];

function drawBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j]) {
                ctx.fillStyle = 'blue';
            } else {
                ctx.fillStyle = (i + j) % 2 === 0 ? 'lightgray' : 'white';
            }
            ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
        }
    }
}

function drawBoard2() {
    for (let i = 0; i < board2.length; i++) {
        for (let j = 0; j < board2[i].length; j++) {
            if (board2[i][j]) {
                ctx2.fillStyle = 'cyan';
            } else {
                ctx2.fillStyle = (i + j) % 2 === 0 ? 'lightgray' : 'white';
            }
            ctx2.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
            ctx2.strokeStyle = 'black';
            ctx2.strokeRect(j * blockSize, i * blockSize, blockSize, blockSize);
        }
    }
}

function drawPiece() {
    for (let i = 0; i < currentPiece.length; i++) {
      for (let j = 0; j < currentPiece[i].length; j++) {
        if (currentPiece[i][j]) {
          ctx.fillStyle = 'red';
          ctx.fillRect((currentX + j) * blockSize, (currentY + i) * blockSize, blockSize, blockSize);
          ctx.strokeStyle = 'black';
          ctx.strokeRect((currentX + j) * blockSize, (currentY + i) * blockSize, blockSize, blockSize);
          
        }
      }
    }
}

function drawPiece2() {
    for (let i = 0; i < currentPiece2.length; i++) {
      for (let j = 0; j < currentPiece2[i].length; j++) {
        if (currentPiece2[i][j]) {
          ctx2.fillStyle = 'orange';
          ctx2.fillRect((currentX2 + j) * blockSize, (currentY2 + i) * blockSize, blockSize, blockSize);
          ctx2.strokeStyle = 'black';
          ctx2.strokeRect((currentX2 + j) * blockSize, (currentY2 + i) * blockSize, blockSize, blockSize);
        }
      }
    }
}

function lockPiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[y + currentY][x + currentX] = 1;
            }
        }
    }
    for (let y = 0; y < board.length; y++) {
        if (board[y].every(value => value === 1)) {
            board.splice(y, 1);
            board.unshift(new Array(10).fill(0));
            score++;
        }
    }
    document.getElementById('score').innerText = 'Score: ' + score;
}

function lockPiece2() {
    for (let y = 0; y < currentPiece2.length; y++) {
        for (let x = 0; x < currentPiece2[y].length; x++) {
            if (currentPiece2[y][x]) {
                board2[y + currentY2][x + currentX2] = 1;
            }
        }
    }
    for (let y = 0; y < board2.length; y++) {
        if (board2[y].every(value => value === 1)) {
            board2.splice(y, 1);
            board2.unshift(new Array(10).fill(0));
            score2++;
        }
    }
    document.getElementById('score2').innerText = 'Score: ' + score2;
}

function generatePiece() {
    console.log('generatePiece called');
    currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentX = Math.floor(board[0].length / 2) - Math.ceil(currentPiece[0].length / 2);
    currentY = 0;
}

function generatePiece2() {
    console.log('generatePiece2 called');
    currentPiece2 = pieces[Math.floor(Math.random() * pieces.length)];
    currentX2 = Math.floor(board2[0].length / 2) - Math.ceil(currentPiece2[0].length / 2);
    currentY2 = 0;
}

function updateGame() {
    currentY++;
    if (collision()) {
        currentY--;
        lockPiece();
        if (currentY === 0) { // if the piece is locked at the top of the board, the game is over
            return gameOver();
        }
        generatePiece();
    }
    drawBoard();
    drawPiece();
}

function updateGame2() {
    currentY2++;
    if (collision2()) {
        currentY2--;
        lockPiece2();
        if (currentY2 === 0) { // if the piece is locked at the top of the board, the game is over
            return gameOver2();
        }
        generatePiece2();
    }
    drawBoard2();
    drawPiece2();
}

let gameInterval1;
let gameInterval2;

function startGame() {
    // Initialize game state
    generatePiece();
    generatePiece2();

    // Start game update
    if (gameInterval1) {
      clearInterval(gameInterval1);
    }
    if (gameInterval2) {
      clearInterval(gameInterval2);
    }
    gameInterval1 = setInterval(updateGame, 500);
    gameInterval2 = setInterval(updateGame2, 500);
    startTimer();

    // Change button text
    const startButton = document.getElementById('start-button');
    startButton.innerText = 'Reiniciar';
}


function restartGame() {
    // Clear the game board
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(10).fill(0);
    }
    for (let i = 0; i < board2.length; i++) {
        board2[i] = new Array(10).fill(0);
    }

    // Reset scores
    score = 0;
    score2 = 0;

    // Reset timer
    timer = 60;

    // Start the game
    startGame();
}
// Update the onclick event for the start button
const startButton = document.getElementById('start-button');
startButton.onclick = restartGame;
function collision() {
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x] && (board[y + currentY] && board[y + currentY][x + currentX]) !== 0) {
          return true;
        }
      }
    }
    return false;
}

function collision2() {
    for (let y = 0; y < currentPiece2.length; y++) {
      for (let x = 0; x < currentPiece2[y].length; x++) {
        if (currentPiece2[y][x] && (board2[y + currentY2] && board2[y + currentY2][x + currentX2]) !== 0) {
          return true;
        }
      }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval1);
    alert("Game Over");
}

function gameOver2() {
    clearInterval(gameInterval2);
    alert("Game Over 2");
}

function rotatePiece() {
    console.log('rotatePiece called');
    const newPiece = [];
    for (let x = 0; x < currentPiece[0].length; x++) {
        newPiece[x] = [];
        for (let y = 0; y < currentPiece.length; y++) {
            newPiece[x][y] = currentPiece[y] ? currentPiece[y][x] : 0;
        }
        newPiece[x].reverse();
    }
    let posX = currentX;
    let posY = currentY;
    let collision = collisionCheck(newPiece, posX, posY);
    if (collision) {
        // Try moving the piece to the right
        while (collision && posX < board[0].length) {
            posX++;
            collision = collisionCheck(newPiece, posX, posY);
        }
        if (collision) {
            // If there is still a collision, try moving the piece to the left
            posX = currentX;
            while (collision && posX >= 0) {
                posX--;
                collision = collisionCheck(newPiece, posX, posY);
            }
        }
        // If there is still a collision, try moving the piece up
        if (collision) {
            posY = currentY;
            while (collision && posY >= 0) {
                posY--;
                collision = collisionCheck(newPiece, posX, posY);
            }
        }
    }
    if (!collision) {
        currentPiece = newPiece;
        currentX = posX;
        currentY = posY;
    }
}

function rotatePiece2() {
    console.log('rotatePiece called2');
    const newPiece = [];
    for (let x = 0; x < currentPiece2[0].length; x++) {
        newPiece[x] = [];
        for (let y = 0; y < currentPiece2.length; y++) {
            newPiece[x][y] = currentPiece2[y] ? currentPiece2[y][x] : 0;
        }
        newPiece[x].reverse();
    }
    let posX = currentX2;
    let posY = currentY2;
    let collision = collisionCheck2(newPiece, posX, posY);
    if (collision) {
        // Try moving the piece to the right
        while (collision && posX < board2[0].length) {
            posX++;
            collision = collisionCheck2(newPiece, posX, posY);
        }
        if (collision) {
            // If there is still a collision, try moving the piece to the left
            posX = currentX2;
            while (collision && posX >= 0) {
                posX--;
                collision = collisionCheck2(newPiece, posX, posY);
            }
        }
        // If there is still a collision, try moving the piece up
        if (collision) {
            posY = currentY2;
            while (collision && posY >= 0) {
                posY--;
                collision = collisionCheck2(newPiece, posX, posY);
            }
        }
    }
    if (!collision) {
        currentPiece2 = newPiece;
        currentX2 = posX;
        currentY2 = posY;
    }
}
function collisionCheck(piece, posX, posY) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                if (y + posY < 0 || y + posY >= board.length || x + posX < 0 || x + posX >= board[0].length) {
                    return true;
                }
                if (board[y + posY][x + posX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function collisionCheck2(piece, posX, posY) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                if (y + posY < 0 || y + posY >= board2.length || x + posX < 0 || x + posX >= board2[0].length) {
                    return true;
                }
                if (board2[y + posY][x + posX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}
function startTimer() {
    setInterval(function() {
        timer--;
        if (timer <= 0) {
            if (score > score2) {
                alert("O jogador 1 ganhou com " + score + " pontos!");
            } else if (score2 > score) {
                alert("O jogador 2 ganhou com " + score2 + " pontos!");
            } else {
                alert("Empate com " + score + " pontos!");
            }
            gameOver();
            gameOver2();
        }
    }, 1000);
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
      case 'ArrowLeft':
        currentX--;
        if (collision()) {
          currentX++;
        }
        break;
      case 'ArrowRight':
        currentX++;
        if (collision()) {
          currentX--;
        }
        break;
      case 'ArrowDown':
        while (!collision()) {
          currentY++;
        }
        currentY--;
        lockPiece();
        generatePiece();
        break;
      case 'j':
        rotatePiece();
        break;
      case 'a':
        currentX2--;
        if (collision2()) {
          currentX2++;
        }
        break;
      case 'd':
        currentX2++;
        if (collision2()) {
            currentX2--;
          }
          break;
        case 's':
          while (!collision2()) {
            currentY2++;
          }
          currentY2--;
          lockPiece2();
          generatePiece2();
          break;
        case 'r':
          rotatePiece2();
          break;
      }
  });