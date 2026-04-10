import './styles/main.css';

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
      lives: 3,
      config: null,
    };

    this.init();
  }

  async init() {
    console.log('Catch My Love initialized');
    await this.fetchConfig();
    this.render();
  }

  async fetchConfig() {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
      // For now, using default config if API fails
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
    this.app.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center space-y-8 animate-soft-spring">
        <h1 class="text-6xl font-bold text-primary">Catch My Love</h1>
        <p class="text-xl text-on-surface-variant max-w-md px-4">
          Prepare your heart! Catch all the love falling from the sky.
        </p>
        <button id="start-btn" class="btn-primary text-xl font-bold shadow-lg shadow-primary/20">
          Start Playing
        </button>
      </div>
    `;

    document.querySelector('#start-btn').addEventListener('click', () => {
      alert('Game starting soon! Phase 2 implementation coming.');
    });
  }
}

new Game();
