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
        const colorSequence = document.getElementById('colorSequence');
        const scoreDisplay = document.getElementById('memoryScore');

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
                const circle = Array.from(colorSequence.children).find(c => c.style.backgroundColor === color);
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

    setupMaps() {
        const findLocationBtn = document.getElementById('findLocation');
        const locationInput = document.getElementById('locationInput');
        const mapDisplay = document.getElementById('mapDisplay');
        const getWeatherBtn = document.getElementById('getWeather');
        const weatherDisplay = document.getElementById('weatherDisplay');

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
        
        // Simulate location finding (in a real app, you'd use a geocoding API)
        mapDisplay.innerHTML = `
            <div class="location-info">
                <h4>📍 Location Found</h4>
                <p><strong>Place:</strong> ${location}</p>
                <p><strong>Coordinates:</strong> ${(Math.random() * 180 - 90).toFixed(4)}°, ${(Math.random() * 360 - 180).toFixed(4)}°</p>
                <p><strong>Region:</strong> ${this.getRandomRegion()}</p>
                <p><strong>Population:</strong> ${Math.floor(Math.random() * 1000000).toLocaleString()}</p>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <div style="font-size: 2rem; text-align: center;">🗺️</div>
                    <p style="text-align: center; margin-top: 0.5rem;">Interactive map view</p>
                </div>
            </div>
        `;
    }

    getRandomRegion() {
        const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
        return regions[Math.floor(Math.random() * regions.length)];
    }

    getWeatherInfo() {
        const weatherDisplay = document.getElementById('weatherDisplay');
        
        // Simulate weather data (in a real app, you'd use a weather API)
        const temperatures = [15, 18, 22, 25, 28, 20, 12];
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Stormy', 'Snowy'];
        const icons = ['☀️', '☁️', '🌧️', '⛅', '⛈️', '❄️'];
        
        const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        weatherDisplay.innerHTML = `
            <div class="weather-info">
                <h4>🌤️ Current Weather</h4>
                <div style="text-align: center; margin: 1rem 0;">
                    <div style="font-size: 3rem;">${randomIcon}</div>
                    <div style="font-size: 2rem; color: #FFD700; margin: 0.5rem 0;">${randomTemp}°C</div>
                    <div style="font-size: 1.2rem;">${randomCondition}</div>
                </div>
                <p><strong>Humidity:</strong> ${Math.floor(Math.random() * 40 + 30)}%</p>
                <p><strong>Wind Speed:</strong> ${Math.floor(Math.random() * 20 + 5)} km/h</p>
                <p><strong>Pressure:</strong> ${Math.floor(Math.random() * 50 + 1000)} hPa</p>
                <p><strong>UV Index:</strong> ${Math.floor(Math.random() * 10)}</p>
            </div>
        `;
    }

    setupInteractiveElements() {
        // Learn More button animation
        const learnMoreBtn = document.getElementById('learnMore');
        learnMoreBtn.addEventListener('click', () => {
            // Switch to career section
            document.querySelector('[data-section="career"]').click();
        });

        // Add hover effects to timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const dot = item.querySelector('.timeline-dot');
                dot.style.transform = 'translateX(-50%) scale(1.5)';
                dot.style.background = '#FFD700';
            });
            
            item.addEventListener('mouseleave', () => {
                const dot = item.querySelector('.timeline-dot');
                if (!dot.classList.contains('active')) {
                    dot.style.transform = 'translateX(-50%) scale(1)';
                    dot.style.background = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });

        // Add scroll animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.game-card, .map-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    resetGames() {
        this.resetTicTacToe();
        this.endMemoryGame();
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Add some extra interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Add floating animation to cards
    const cards = document.querySelectorAll('.game-card, .map-card');
    cards.forEach((card, index) => {
        card.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});