import './styles/main.css';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { setupResponsiveHandler } from './utils/responsive';

class Game {
  constructor() {
    this.app = document.querySelector('#app');
    this.state = {
      view: 'start',
      score: 0,
      level: 1,
      lives: 6,
      config: null,
      combo: 1,
      user: {
        name: 'Heart Seeker',
        level: 12,
        hearts: 4200,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFxVymTUVmlBs4jNzKpFARXMinjZmOylycIc2sOetnwSeRWqekmZiNpyY7YpRpOGt6B8PzqRnyVTcKlGomfdJS0Pf3JMtw5WmTqeuaOl68ZgzMfIjSSwVhUUKPLTZLEUXigurgvk4J6k_GEQOWzP4z8tEUTWawYFudz0uVIzAeACAz7eTpqQdGvqZRxaBW3mOjpvMFtkcTpZ8Wmz8qup42Gk7xbAjFFg69K2vkh7MzZmoVJB77-z14Y48ySAdO1XvYlcIs0HVJQqk'
      }
    };

    this.init();
  }

  async init() {
    console.log('Catch My Love initialized');
    await this.fetchConfig();
    this.render();

    setupResponsiveHandler((bounds) => {
      if (this.gameBoard) {
        this.gameBoard.updateBounds();
        this.gameBoard.render();
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
    } else if (this.state.view === 'leaderboard') {
      this.renderLeaderboard();
    } else if (this.state.view === 'settings') {
      this.renderSettings();
    }
  }

  renderStartScreen() {
    this.app.innerHTML = `
      <div class="fixed inset-0 z-0 vibrant-gradient-bg opacity-40"></div>
      <div class="fixed top-20 left-[10%] floating-heart opacity-30 text-primary-container" style="font-size: 80px;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>
      <div class="fixed bottom-40 right-[15%] floating-heart opacity-20 text-secondary-container" style="font-size: 120px; animation-delay: -2s;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>
      <div class="fixed top-1/2 left-[5%] floating-heart opacity-10 text-tertiary-container" style="font-size: 60px; animation-delay: -4s;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>

      <header class="flex justify-between items-center w-full px-6 py-4 absolute top-0 z-50">
        <div class="text-2xl font-black text-[#a8275a] italic font-headline">Catch My Love</div>
        <div class="flex gap-4">
          <button id="settings-btn" class="material-symbols-outlined text-[#5d5b58] hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full">settings</button>
        </div>
      </header>

      <main class="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div class="mb-12 relative">
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-full shadow-lg transform -rotate-2">
            <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">stars</span>
            <span class="font-label font-bold text-xs">VERSION 3.0 VIBRANT</span>
          </div>
          <h1 class="font-headline font-black text-7xl md:text-8xl tracking-tighter text-primary drop-shadow-sm mb-2">
            Catch My <span class="text-primary-container">Love</span>
          </h1>
          <p class="font-body text-on-surface-variant text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Unlock the rhythm of your heart in this high-energy arcade adventure.
          </p>
        </div>

        <div class="flex flex-col items-center gap-8 w-full max-w-sm">
          <button id="play-btn" class="group relative w-full py-6 px-12 bg-gradient-to-r from-primary to-primary-container text-on-primary text-2xl font-black rounded-xl shadow-[0_20px_40px_rgba(168,39,90,0.25)] bouncy-hover flex items-center justify-center gap-4">
            <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
            PLAY
            <div class="absolute -top-2 -right-2 bg-tertiary-container text-on-tertiary-container p-2 rounded-full shadow-md transform rotate-12 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            </div>
          </button>

          <div class="grid grid-cols-2 gap-4 w-full">
            <div id="leaderboard-btn" class="bg-surface-container-lowest glass-panel p-6 rounded-lg shadow-sm border border-outline-variant/10 bouncy-hover flex flex-col items-start justify-between min-h-[140px] text-left cursor-pointer">
              <span class="material-symbols-outlined text-secondary text-3xl mb-4">leaderboard</span>
              <div>
                <span class="block font-label text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-1">Rankings</span>
                <h3 class="font-headline font-bold text-lg text-on-surface">Top Scores</h3>
              </div>
            </div>

            <div id="daily-btn" class="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 bouncy-hover flex flex-col items-start justify-between min-h-[140px] text-left cursor-pointer">
              <div class="flex justify-between w-full items-start">
                <span class="material-symbols-outlined text-tertiary text-3xl">redeem</span>
                <div class="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              </div>
              <div>
                <span class="block font-label text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-1">Rewards</span>
                <h3 class="font-headline font-bold text-lg text-on-surface">Daily Gift</h3>
              </div>
            </div>
          </div>

          <div id="profile-btn" class="w-full bg-surface-container-high/50 backdrop-blur-sm p-4 rounded-lg flex items-center gap-4 cursor-pointer">
            <div class="relative">
              <img alt="Player Profile" class="w-12 h-12 rounded-full object-cover border-2 border-primary-container shadow-md" src="${this.state.user.avatar}"/>
              <div class="absolute -bottom-1 -right-1 bg-secondary-container w-5 h-5 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[10px] text-on-secondary-container" style="font-variation-settings: 'FILL' 1;">bolt</span>
              </div>
            </div>
            <div class="text-left">
              <p class="font-headline font-bold text-on-surface text-sm">${this.state.user.name}</p>
              <p class="font-label text-on-surface-variant text-xs font-medium">Level ${this.state.user.level} • ${this.state.user.hearts.toLocaleString()} Hearts</p>
            </div>
            <button class="ml-auto material-symbols-outlined text-primary hover:bg-white/50 p-2 rounded-full transition-colors">arrow_forward_ios</button>
          </div>
        </div>

        <footer class="mt-16 text-on-surface-variant/60 font-label text-[10px] uppercase tracking-widest flex items-center gap-6">
          <span class="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
          <span class="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
          <span>© 2024 LoveStudios</span>
        </footer>
      </main>

      <div class="fixed top-0 right-0 h-screen w-32 pointer-events-none opacity-20 overflow-hidden hidden lg:block">
        <div class="flex flex-col gap-12 mt-20">
          <span class="material-symbols-outlined text-primary text-6xl rotate-12">favorite</span>
          <span class="material-symbols-outlined text-secondary text-4xl -rotate-6 ml-10">favorite</span>
          <span class="material-symbols-outlined text-tertiary text-7xl rotate-45">favorite</span>
          <span class="material-symbols-outlined text-primary-container text-3xl -rotate-12 ml-4">favorite</span>
          <span class="material-symbols-outlined text-secondary-container text-8xl rotate-12">favorite</span>
        </div>
      </div>
    `;

    document.querySelector('#play-btn').addEventListener('click', () => {
      this.state.view = 'playing';
      this.render();
    });

    document.querySelector('#leaderboard-btn').addEventListener('click', () => {
      this.state.view = 'leaderboard';
      this.render();
    });

    document.querySelector('#daily-btn').addEventListener('click', () => {
      alert('Daily reward claimed! +100 Hearts');
    });

    document.querySelector('#profile-btn').addEventListener('click', () => {
      console.log('Profile clicked');
    });

    document.querySelector('#settings-btn').addEventListener('click', () => {
      this.state.view = 'settings';
      this.render();
    });
  }

  renderGameBoard() {
    this.gameBoard = new GameBoard(this.app, this.state, () => this.goToHome());
    this.gameBoard.start();
  }

  renderLeaderboard() {
    this.app.innerHTML = `
      <div class="fixed inset-0 z-0 vibrant-gradient-bg opacity-20"></div>
      
      <header class="flex justify-between items-center w-full px-6 py-4 absolute top-0 z-50">
        <button id="back-btn" class="material-symbols-outlined text-[#5d5b58] hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full">arrow_back</button>
        <div class="text-2xl font-black text-[#a8275a] italic font-headline">Catch My Love</div>
        <div class="w-10"></div>
      </header>

      <main class="relative z-10 min-h-screen flex flex-col items-center px-6 pt-24">
        <div class="w-full max-w-sm">
          <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-6 rounded-xl shadow-lg mb-8">
            <h2 class="font-headline font-black text-3xl text-primary mb-2">Your Rankings</h2>
            <p class="font-body text-on-surface-variant">See how you compare</p>
          </div>

          <div class="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl overflow-hidden">
            <div id="leaderboard-container" class="divide-y divide-outline-variant/20">
              <div class="flex items-center justify-center p-8">
                <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    document.querySelector('#back-btn').addEventListener('click', () => {
      this.state.view = 'start';
      this.render();
    });

    const container = document.querySelector('#leaderboard-container');
    new Leaderboard(container, this.state.user);
  }

  renderSettings() {
    this.app.innerHTML = `
      <div class="fixed inset-0 z-0 vibrant-gradient-bg opacity-20"></div>
      
      <header class="flex justify-between items-center w-full px-6 py-4 absolute top-0 z-50">
        <button id="back-btn" class="material-symbols-outlined text-[#5d5b58] hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full">arrow_back</button>
        <div class="text-2xl font-black text-[#a8275a] italic font-headline">Catch My Love</div>
        <div class="w-10"></div>
      </header>

      <main class="relative z-10 min-h-screen flex flex-col items-center px-6 pt-24">
        <div class="w-full max-w-sm">
          <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-6 rounded-xl shadow-lg mb-6">
            <h2 class="font-headline font-black text-3xl text-primary mb-2">Settings</h2>
            <p class="font-body text-on-surface-variant">Customize your experience</p>
          </div>

          <div class="space-y-4">
            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-secondary text-2xl">volume_up</span>
                <div>
                  <p class="font-headline font-bold text-on-surface">Sound Effects</p>
                  <p class="font-label text-xs text-on-surface-variant">Game sounds and feedback</p>
                </div>
              </div>
              <div class="w-12 h-6 bg-primary-container rounded-full relative">
                <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>

            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-secondary text-2xl">vibration</span>
                <div>
                  <p class="font-headline font-bold text-on-surface">Haptics</p>
                  <p class="font-label text-xs text-on-surface-variant">Vibration feedback</p>
                </div>
              </div>
              <div class="w-12 h-6 bg-primary-container rounded-full relative">
                <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>

            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-secondary text-2xl">notifications</span>
                <div>
                  <p class="font-headline font-bold text-on-surface">Notifications</p>
                  <p class="font-label text-xs text-on-surface-variant">Daily reminders</p>
                </div>
              </div>
              <div class="w-12 h-6 bg-surface-variant rounded-full relative">
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>

            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-secondary text-2xl">dark_mode</span>
                <div>
                  <p class="font-headline font-bold text-on-surface">Dark Mode</p>
                  <p class="font-label text-xs text-on-surface-variant">Coming soon</p>
                </div>
              </div>
              <div class="px-3 py-1 bg-surface-variant rounded-full">
                <span class="font-label text-xs text-on-surface-variant">Soon</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    document.querySelector('#back-btn').addEventListener('click', () => {
      this.state.view = 'start';
      this.render();
    });
  }

  goToHome() {
    this.state.view = 'start';
    this.render();
  }
}

new Game();