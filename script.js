 document.addEventListener('DOMContentLoaded', () => {
    // Section Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const sectionId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Animated Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const updateNumber = () => {
            const target = +stat.getAttribute('data-target');
            let count = +stat.innerText;
            const increment = target / 100;

            if (count < target) {
                stat.innerText = Math.ceil(count + increment);
                setTimeout(updateNumber, 30);
            } else {
                stat.innerText = target;
            }
        };
        updateNumber();
    });

    // Skill Bars Animation
    const skillProgress = document.querySelectorAll('.skill-progress');
    skillProgress.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });

    // Learn More Button Scroll
    document.getElementById('learnMore').addEventListener('click', () => {
        document.querySelector('#career').scrollIntoView({ behavior: 'smooth' });
    });

    // ---------------- TIC TAC TOE ----------------
    const board = Array(9).fill(null);
    let currentPlayer = 'X';
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const resetBtn = document.getElementById('resetTicTacToe');

    function checkWinner() {
        const winPatterns = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[b] === board[c]) {
                return board[a];
            }
        }
        return board.includes(null) ? null : 'Draw';
    }

    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        if (!board[index]) {
            board[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            const winner = checkWinner();
            if (winner) {
                gameStatus.textContent = winner === 'Draw' ? "It's a draw!" : `Player ${winner} wins!`;
                cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            }
        }
    }

    function resetGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick);
        });
        currentPlayer = 'X';
        gameStatus.textContent = "Player X's turn";
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);

    // --------------- COLOR MEMORY GAME ----------------
    const sequenceColors = ['red', 'green', 'blue', 'yellow'];
    let sequence = [];
    let playerSequence = [];
    let score = 0;

    const colorSequenceDiv = document.getElementById('colorSequence');
    const startMemoryGame = document.getElementById('startMemoryGame');
    const memoryScore = document.getElementById('memoryScore');

    function playSequence(seq) {
        colorSequenceDiv.innerHTML = '';
        seq.forEach((color, index) => {
            setTimeout(() => {
                const colorDiv = document.createElement('div');
                colorDiv.style.backgroundColor = color;
                colorDiv.className = 'color-flash';
                colorSequenceDiv.appendChild(colorDiv);
                setTimeout(() => colorDiv.remove(), 500);
            }, index * 800);
        });
    }

    function nextRound() {
        const nextColor = sequenceColors[Math.floor(Math.random() * sequenceColors.length)];
        sequence.push(nextColor);
        playSequence(sequence);
        playerSequence = [];
    }

    function handleColorClick(color) {
        playerSequence.push(color);
        const index = playerSequence.length - 1;
        if (playerSequence[index] !== sequence[index]) {
            alert('Game Over!');
            score = 0;
            sequence = [];
            memoryScore.textContent = score;
        } else if (playerSequence.length === sequence.length) {
            score++;
            memoryScore.textContent = score;
            setTimeout(nextRound, 1000);
        }
    }

    startMemoryGame.addEventListener('click', () => {
        nextRound();
        sequenceColors.forEach(color => {
            const btn = document.createElement('button');
            btn.textContent = color;
            btn.style.backgroundColor = color;
            btn.className = 'color-btn';
            btn.onclick = () => handleColorClick(color);
            colorSequenceDiv.appendChild(btn);
        });
    });

    // --------------- LOCATION FINDER ----------------
    document.getElementById('findLocation').addEventListener('click', () => {
        const location = document.getElementById('locationInput').value;
        const mapDisplay = document.getElementById('mapDisplay');
        if (location.trim() !== '') {
            mapDisplay.innerHTML = `<p>Map loading for: <strong>${location}</strong> (Placeholder)</p>`;
        }
    });

    // --------------- WEATHER ----------------
    document.getElementById('getWeather').addEventListener('click', () => {
        const weatherDisplay = document.getElementById('weatherDisplay');
        weatherDisplay.innerHTML = `
            <div class="weather-info">
                <h4>Weather: Sunny</h4>
                <p>Temperature: 30°C</p>
                <p>Humidity: 45%</p>
            </div>
        `;
    });
});
