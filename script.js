 // Main JavaScript functionality
class Portfolio {
    constructor() {
        this.currentSection = 'home';
        this.ticTacToeGame = null;
        this.memoryGame = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.setupGames();
        this.setupMaps();
        this.setupInteractiveElements();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                
                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                this.currentSection = targetSection;
                
                // Trigger section-specific animations
                this.triggerSectionAnimations(targetSection);
            });
        });
    }

    setupAnimations() {
        // Animate stats on home page
        this.animateStats();
        
        // Animate skill bars when career section is viewed
        this.setupSkillBars();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateStat = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Start animation when home section is active
            if (this.currentSection === 'home') {
                setTimeout(updateStat, 500);
            }
        });
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0%';
        });
    }

    triggerSectionAnimations(section) {
        switch(section) {
            case 'home':
                this.animateStats();
                break;
            case 'career':
                this.animateSkillBars();
                break;
            case 'games':
                this.resetGames();
                break;
        }
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 200);
        });
    }

    setupGames() {
        this.setupTicTacToe();
        this.setupMemoryGame();
    }

    setupTicTacToe() {
        this.ticTacToeGame = {
            board: Array(9).fill(''),
            currentPlayer: 'X',
            gameActive: true,
            winningConditions: [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ]
        };

        const cells = document.querySelectorAll('.cell');
        const resetButton = document.getElementById('resetTicTacToe');
        const gameStatus = document.getElementById('gameStatus');

        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const index = parseInt(cell.getAttribute('data-index'));
                
                if (this.ticTacToeGame.board[index] === '' && this.ticTacToeGame.gameActive) {
                    this.ticTacToeGame.board[index] = this.ticTacToeGame.currentPlayer;
                    cell.textContent = this.ticTacToeGame.currentPlayer;
                    cell.style.color = this.ticTacToeGame.currentPlayer === 'X' ? '#FFD700' : '#FFA500';
                    
                    if (this.checkTicTacToeWin()) {
                        gameStatus.textContent = `Player ${this.ticTacToeGame.currentPlayer} wins!`;
                        gameStatus.style.color = '#FFD700';
                        this.ticTacToeGame.gameActive = false;
                    } else if (this.ticTacToeGame.board.every(cell => cell !== '')) {
                        gameStatus.textContent = "It's a draw!";
                        gameStatus.style.color = '#FFA500';
                        this.ticTacToeGame.gameActive = false;
                    } else {
                        this.ticTacToeGame.currentPlayer = this.ticTacToeGame.currentPlayer === 'X' ? 'O' : 'X';
                        gameStatus.textContent = `Player ${this.ticTacToeGame.currentPlayer}'s turn`;
                        gameStatus.style.color = 'white';
                    }
                }
            });
        });

        resetButton.addEventListener('click', () => {
            this.resetTicTacToe();
        });
    }

    checkTicTacToeWin() {
        return this.ticTacToeGame.winningConditions.some(condition => {
            return condition.every(index => {
                return this.ticTacToeGame.board[index] === this.ticTacToeGame.currentPlayer;
            });
        });
    }

    resetTicTacToe() {
        this.ticTacToeGame.board = Array(9).fill('');
        this.ticTacToeGame.currentPlayer = 'X';
        this.ticTacToeGame.gameActive = true;
        
        const cells = document.querySelectorAll('.cell');
        const gameStatus = document.getElementById('gameStatus');
        
        cells.forEach(cell => {
            cell.textContent = '';
        });
        
        gameStatus.textContent = "Player X's turn";
        gameStatus.style.color = 'white';
    }

    setupMemoryGame() {
        this.memoryGame = {
            sequence: [],
            userSequence: [],
            score: 0,
            isPlaying: false,
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
        };

        const startButton = document.getElementById('startMemoryGame');
        startButton.addEventListener('click', () => {
            this.startMemoryGame();
        });
    }

    startMemoryGame() {
        this.memoryGame.sequence = [];
        this.memoryGame.userSequence = [];
        this.memoryGame.score = 0;
        this.memoryGame.isPlaying = true;
        
        document.getElementById('memoryScore').textContent = this.memoryGame.score;
        document.getElementById('startMemoryGame').textContent = 'Playing...';
        document.getElementById('startMemoryGame').disabled = true;
        
        this.addToSequence();
    }

    addToSequence() {
        const randomColor = this.memoryGame.colors[Math.floor(Math.random() * this.memoryGame.colors.length)];
        this.memoryGame.sequence.push(randomColor);
        this.playSequence();
    }

    playSequence() {
        const colorSequence = document.getElementById('colorSequence');
        colorSequence.innerHTML = '';
        
        // Create color circles
        this.memoryGame.colors.forEach(color => {
            const circle = document.createElement('div');
            circle.className = 'color-circle';
            circle.style.backgroundColor = color;
            circle.addEventListener('click', () => this.handleColorClick(color));
            colorSequence.appendChild(circle);
        });

        // Play the sequence
        this.memoryGame.sequence.forEach((color, index) => {
            setTimeout(() => {
                const circle = Array.from(colorSequence.children).find(c => 
                    this.rgbToHex(c.style.backgroundColor) === color.toLowerCase() || 
                    c.style.backgroundColor === color
                );
                if (circle) {
                    circle.classList.add('flash');
                    setTimeout(() => circle.classList.remove('flash'), 500);
                }
            }, (index + 1) * 600);
        });
        
        // Reset user sequence after showing
        setTimeout(() => {
            this.memoryGame.userSequence = [];
        }, this.memoryGame.sequence.length * 600 + 500);
    }

    handleColorClick(color) {
        if (!this.memoryGame.isPlaying) return;
        
        this.memoryGame.userSequence.push(color);
        
        // Check if current click is correct
        const currentIndex = this.memoryGame.userSequence.length - 1;
        if (this.memoryGame.userSequence[currentIndex] !== this.memoryGame.sequence[currentIndex]) {
            this.endMemoryGame();
            return;
        }
        
        // Check if sequence is complete
        if (this.memoryGame.userSequence.length === this.memoryGame.sequence.length) {
            this.memoryGame.score++;
            document.getElementById('memoryScore').textContent = this.memoryGame.score;
            
            setTimeout(() => {
                this.addToSequence();
            }, 1000);
        }
    }

    endMemoryGame() {
        this.memoryGame.isPlaying = false;
        document.getElementById('startMemoryGame').textContent = 'Start Game';
        document.getElementById('startMemoryGame').disabled = false;
        
        setTimeout(() => {
            alert(`Game Over! Final Score: ${this.memoryGame.score}`);
        }, 100);
    }

    rgbToHex(rgb) {
        // Convert rgb(r, g, b) to hex format for color comparison
        const result = rgb.match(/\d+/g);
        if (result) {
            return "#" + result.map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }).join("");
        }
        return rgb;
    }

    setupMaps() {
        const findLocationBtn = document.getElementById('findLocation');
        const locationInput = document.getElementById('locationInput');
        const getWeatherBtn = document.getElementById('getWeather');

        findLocationBtn.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                this.findLocation(location);
            }
        });

        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const location = locationInput.value.trim();
                if (location) {
                    this.findLocation(location);
                }
            }
        });

        getWeatherBtn.addEventListener('click', () => {
            this.getWeatherInfo();
        });
    }

    findLocation(location) {
        const mapDisplay = document.getElementById('mapDisplay');
        
        // Show loading state
        mapDisplay.innerHTML = '<div style="color: white; text-align: center;">🔍 Searching for location...</div>';
        
        // Simulate API call delay
        setTimeout(() => {
            mapDisplay.innerHTML = `
                <div class="location-info">
                    <h4>📍 Location Found</h4>
                    <p><strong>Place:</strong> ${location}</p>
                    <p><strong>Coordinates:</strong> ${(Math.random() * 180 - 90).toFixed(4)}°, ${(Math.random() * 360 - 180).toFixed(4)}°</p>
                    <p><strong>Region:</strong> ${this.getRandomRegion()}</p>
                    <p><strong>Population:</strong> ${Math.floor(Math.random() * 1000000).toLocaleString()}</p>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: