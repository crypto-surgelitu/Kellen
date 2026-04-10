import './styles/main.css';
import { GameBoard } from './components/GameBoard';
import { setupResponsiveHandler } from './utils/responsive';

/**
 * Catch My Love - Main Entry Point
 */

class Game {
  constructor() {
    this.app = document.querySelector('#app');
    this.state = {
      view: 'start', // start, playing, gameover
      score: 0,
      level: 1,
      lives: 6,
      config: null,
    };

    this.init();
  }

  async init() {
    console.log('Catch My Love initialized');
    await this.fetchConfig();
    this.render();
    
    // Set up responsive resize listener
    setupResponsiveHandler((bounds) => {
      if (this.gameBoard) {
        this.gameBoard.updateBounds();
        this.gameBoard.render(); // Re-render if necessary or just update positions
      }
    });
  }

  async fetchConfig() {
    try {
      this.state.config = {
        heartSpeed: 2,
        spawnRate: 1000,
        bucketSpeed: 10,
      };
      console.log('Game configuration loaded');
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  }

  render() {
    if (this.state.view === 'start') {
      this.renderStartScreen();
    } else if (this.state.view === 'playing') {
      this.renderGameBoard();
    }
  }

  renderStartScreen() {
    this.app.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center p-6 space-y-12 animate-soft-spring">
        <div class="space-y-4">
          <h1 class="text-7xl font-display font-bold text-primary leading-tight">Catch<br/>My Love</h1>
          <p class="text-xl font-body text-on-surface-variant max-w-xs mx-auto">
            Spread your heart wide and catch the falling love.
          </p>
        </div>
        
        <div class="relative w-full max-w-xs">
          <button id="start-btn" class="btn-primary w-full text-2xl font-bold py-6 shadow-2xl shadow-primary/30">
            Start Playing
          </button>
          
          <!-- Decorative hearts -->
          <span class="absolute -top-4 -left-4 text-4xl animate-bounce" style="animation-delay: 0.2s">💖</span>
          <span class="absolute -bottom-4 -right-4 text-4xl animate-bounce" style="animation-delay: 0.5s">💝</span>
        </div>

        <footer class="absolute bottom-10 w-full text-center">
          <span class="text-sm font-label text-on-surface-variant/60">A Playful Premium Experience</span>
        </footer>
      </div>
    `;

    document.querySelector('#start-btn').addEventListener('click', () => {
      this.state.view = 'playing';
      this.render();
    });
  }

  renderGameBoard() {
    this.gameBoard = new GameBoard(this.app, this.state, () => this.goToHome());
    this.gameBoard.start();
  }

  goToHome() {
    this.state.view = 'start';
    this.render();
  }
}

new Game();
