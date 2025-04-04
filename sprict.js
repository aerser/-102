const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        contents.forEach(content => content.classList.remove('active'));
        document.getElementById(tab.getAttribute('data-target')).classList.add('active');
    });
});

// 反射神経テスト
const testBox = document.getElementById('testBox');
let startTime;
let reactionTimes = [];

testBox.addEventListener('click', function() {
    if (testBox.textContent === 'クリックして開始') {
        testBox.textContent = '待ってください...';
        setTimeout(() => {
            startTime = new Date();
            testBox.textContent = '今すぐクリック！';
            testBox.style.backgroundColor = '#32cd32';
        }, Math.random() * 3000 + 1000); // 1～4秒後に反応
    } else if (testBox.textContent === '今すぐクリック！') {
        const reactionTime = new Date() - startTime;
        reactionTimes.push(reactionTime);
        testBox.textContent = `反応時間: ${reactionTime}ms`;
        testBox.style.backgroundColor = '#ff6347';

        const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        document.getElementById('average-time').innerText = `平均時間: ${averageTime.toFixed(2)} ms`;

        setTimeout(() => {
            testBox.textContent = 'クリックして開始';
        }, 2000); // 2秒後にリセット
    }
});

// 間違い探し
const startButton = document.getElementById('startButton');
const emojiGrid = document.getElementById('emojiGrid');
const result = document.getElementById('result');
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'];
let startSpotTime;

function generateEmojis() {
    emojiGrid.innerHTML = '';
    const correctEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const wrongEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const wrongPosition = Math.floor(Math.random() * 25);

    for (let i = 0; i < 25; i++) {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = i === wrongPosition ? wrongEmoji : correctEmoji;
        emojiSpan.classList.add('emoji');
        emojiSpan.addEventListener('click', () => {
            if (i === wrongPosition) {
                const reactionTime = new Date() - startSpotTime;
                result.textContent = `間違い発見時間: ${reactionTime}ms`;
            } else {
                result.textContent = '間違いではありません！';
            }
        });
        emojiGrid.appendChild(emojiSpan);
    }

    startSpotTime = new Date();
}

startButton.addEventListener('click', generateEmojis);

// アルカノイドゲーム
const canvas = document.getElementById("arkanoidCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            // Remove the alert and reload, and reset the ball position instead
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            score = 0;
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    bricks[c][r].status = 1;
                }
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
