import './styles/main.css';
import { GameBoard } from './components/GameBoard';
import { Leaderboard } from './components/Leaderboard';
import { setupResponsiveHandler } from './utils/responsive';
import { setSoundEnabled } from './utils/audio';

class Game {
  constructor() {
    this.app = document.querySelector('#app');
    this.settings = {
      sound: true,
      haptics: true,
      darkMode: false
    };
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

  toggleDarkMode(enable) {
    this.settings.darkMode = enable;
    if (enable) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', enable);
  }

  async init() {
    console.log('Catch My Love initialized');
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      this.settings.darkMode = true;
      document.documentElement.classList.add('dark');
    }
    
    const savedSound = localStorage.getItem('sound');
    if (savedSound !== null) {
      this.settings.sound = savedSound === 'true';
      setSoundEnabled(this.settings.sound);
    }
    
    const savedHaptics = localStorage.getItem('haptics');
    if (savedHaptics !== null) {
      this.settings.haptics = savedHaptics === 'true';
    }
    
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
      <div class="fixed top-16 sm:top-20 left-[5%] sm:left-[10%] floating-heart opacity-30 text-primary-container" style="font-size: 40px; sm: 80px;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>
      <div class="fixed bottom-32 sm:bottom-40 right-[8%] sm:right-[15%] floating-heart opacity-20 text-secondary-container" style="font-size: 60px; sm: 120px; animation-delay: -2s;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>
      <div class="fixed top-1/2 left-[3%] sm:left-[5%] floating-heart opacity-10 text-tertiary-container" style="font-size: 30px; sm: 60px; animation-delay: -4s;">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
      </div>

      <header class="flex justify-between items-center w-full px-4 sm:px-6 py-3 sm:py-4 absolute top-0 z-50">
        <div class="text-lg sm:text-2xl font-black text-primary italic font-headline">Catch My Love</div>
        <div class="flex gap-3 sm:gap-4">
          <button id="settings-btn" class="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity p-1.5 sm:p-2 bg-surface-container-low rounded-full text-xl sm:text-2xl">settings</button>
        </div>
      </header>

      <main class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-6 text-center overflow-y-auto">
        <div class="mb-6 sm:mb-10 relative w-full max-w-sm">
          <div class="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-tertiary-container text-on-tertiary-container rounded-full shadow-lg transform -rotate-2">
            <span class="material-symbols-outlined text-xs sm:sm" style="font-variation-settings: 'FILL' 1;">stars</span>
            <span class="font-label font-bold text-[10px] sm:text-xs">VERSION 3.0</span>
          </div>
          <h1 class="font-headline font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-primary drop-shadow-sm mb-2 leading-none">
            Catch My <span class="text-primary-container">Love</span>
          </h1>
          <p class="font-body text-on-surface-variant text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md mx-auto leading-relaxed mt-2">
            Unlock the rhythm of your heart in this high-energy arcade adventure.
          </p>
        </div>

        <div class="flex flex-col items-center gap-5 sm:gap-6 w-full max-w-xs sm:max-w-sm">
          <button id="play-btn" class="group relative w-full py-4 sm:py-5 px-8 sm:px-10 bg-gradient-to-r from-primary to-primary-container text-white text-xl sm:text-2xl font-black rounded-xl shadow-[0_20px_40px_rgba(168,39,90,0.25)] bouncy-hover flex items-center justify-center gap-3">
            <span class="material-symbols-outlined text-3xl sm:text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
            PLAY
            <div class="absolute -top-2 -right-2 bg-tertiary-container text-on-tertiary-container p-1.5 sm:p-2 rounded-full shadow-md transform rotate-12 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-sm sm:text-base" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            </div>
          </button>

          <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            <div id="leaderboard-btn" class="bg-surface-container-lowest/90 glass-panel p-3 sm:p-5 rounded-lg shadow-sm border border-outline-variant/10 bouncy-hover flex flex-col items-start justify-between min-h-[100px] sm:min-h-[120px] text-left cursor-pointer">
              <span class="material-symbols-outlined text-secondary text-2xl sm:text-3xl mb-2 sm:mb-3">leaderboard</span>
              <div>
                <span class="block font-label text-on-surface-variant text-[10px] sm:text-xs uppercase tracking-wider font-bold mb-0.5 sm:mb-1">Rankings</span>
                <h3 class="font-headline font-bold text-sm sm:text-base text-on-surface">Top Scores</h3>
              </div>
            </div>

            <div id="daily-btn" class="bg-surface-container-low/90 p-3 sm:p-5 rounded-lg border border-outline-variant/10 bouncy-hover flex flex-col items-start justify-between min-h-[100px] sm:min-h-[120px] text-left cursor-pointer">
              <div class="flex justify-between w-full items-start">
                <span class="material-symbols-outlined text-tertiary text-2xl sm:text-3xl mb-2 sm:mb-3">redeem</span>
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error animate-pulse"></div>
              </div>
              <div>
                <span class="block font-label text-on-surface-variant text-[10px] sm:text-xs uppercase tracking-wider font-bold mb-0.5 sm:mb-1">Rewards</span>
                <h3 class="font-headline font-bold text-sm sm:text-base text-on-surface">Daily Gift</h3>
              </div>
            </div>
          </div>

          <div id="profile-btn" class="w-full bg-surface-container-high/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex items-center gap-3 cursor-pointer">
            <div class="relative shrink-0">
              <img alt="Player Profile" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary-container shadow-md" src="${this.state.user.avatar}"/>
              <div class="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-secondary-container w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                <span class="material-symbols-outlined text-[8px] sm:text-[10px] text-on-secondary-container" style="font-variation-settings: 'FILL' 1;">bolt</span>
              </div>
            </div>
            <div class="text-left min-w-0">
              <p class="font-headline font-bold text-on-surface text-sm truncate">${this.state.user.name}</p>
              <p class="font-label text-on-surface-variant text-[10px] sm:text-xs font-medium truncate">Level ${this.state.user.level} • ${this.state.user.hearts.toLocaleString()} Hearts</p>
            </div>
            <button class="ml-auto shrink-0 material-symbols-outlined text-primary hover:bg-white/50 p-1.5 sm:p-2 rounded-full transition-colors text-lg sm:text-xl">arrow_forward_ios</button>
          </div>
        </div>

        <footer class="mt-6 sm:mt-10 text-on-surface-variant/60 font-label text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-4 flex-wrap px-2">
          <span class="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span class="w-1 h-1 bg-outline-variant rounded-full hidden sm:inline"></span>
          <span class="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          <span class="w-1 h-1 bg-outline-variant rounded-full hidden sm:inline"></span>
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
        <button id="back-btn" class="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full">arrow_back</button>
        <div class="text-2xl font-black text-primary italic font-headline">Catch My Love</div>
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
    const soundEnabled = this.settings.sound;
    const hapticsEnabled = this.settings.haptics;
    const darkEnabled = this.settings.darkMode;

    this.app.innerHTML = `
      <div class="fixed inset-0 z-0 vibrant-gradient-bg opacity-20"></div>
      
      <header class="flex justify-between items-center w-full px-4 sm:px-6 py-3 sm:py-4 absolute top-0 z-50">
        <button id="back-btn" class="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity p-1.5 sm:p-2 bg-surface-container-low rounded-full text-xl sm:text-2xl">arrow_back</button>
        <div class="text-lg sm:text-2xl font-black text-primary italic font-headline">Catch My Love</div>
        <div class="w-8 sm:w-10"></div>
      </header>

      <main class="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24">
        <div class="w-full max-w-sm">
          <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-5 sm:p-6 rounded-xl shadow-lg mb-5 sm:mb-6">
            <h2 class="font-headline font-black text-2xl sm:text-3xl text-primary mb-1 sm:mb-2">Settings</h2>
            <p class="font-body text-on-surface-variant text-sm sm:text-base">Customize your experience</p>
          </div>

          <div class="space-y-3 sm:space-y-4">
            <div id="toggle-sound" class="bg-surface-container-lowest/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="material-symbols-outlined text-secondary text-xl sm:text-2xl">volume_up</span>
                <div>
                  <p class="font-headline font-bold text-on-surface text-sm sm:text-base">Sound Effects</p>
                  <p class="font-label text-[10px] sm:text-xs text-on-surface-variant">Game sounds</p>
                </div>
              </div>
              <div class="w-10 sm:w-12 h-5 sm:h-6 ${soundEnabled ? 'bg-primary-container' : 'bg-surface-variant'} rounded-full relative transition-colors">
                <div class="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${soundEnabled ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}"></div>
              </div>
            </div>

            <div id="toggle-haptics" class="bg-surface-container-lowest/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="material-symbols-outlined text-secondary text-xl sm:text-2xl">vibration</span>
                <div>
                  <p class="font-headline font-bold text-on-surface text-sm sm:text-base">Haptics</p>
                  <p class="font-label text-[10px] sm:text-xs text-on-surface-variant">Vibration</p>
                </div>
              </div>
              <div class="w-10 sm:w-12 h-5 sm:h-6 ${hapticsEnabled ? 'bg-primary-container' : 'bg-surface-variant'} rounded-full relative transition-colors">
                <div class="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${hapticsEnabled ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}"></div>
              </div>
            </div>

            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="material-symbols-outlined text-secondary text-xl sm:text-2xl">notifications</span>
                <div>
                  <p class="font-headline font-bold text-on-surface text-sm sm:text-base">Notifications</p>
                  <p class="font-label text-[10px] sm:text-xs text-on-surface-variant">Daily reminders</p>
                </div>
              </div>
              <div class="w-10 sm:w-12 h-5 sm:h-6 bg-surface-variant rounded-full relative">
                <div class="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>

            <div id="toggle-dark" class="bg-surface-container-lowest/80 backdrop-blur-xl p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="material-symbols-outlined text-secondary text-xl sm:text-2xl">dark_mode</span>
                <div>
                  <p class="font-headline font-bold text-on-surface text-sm sm:text-base">Dark Mode</p>
                  <p class="font-label text-[10px] sm:text-xs text-on-surface-variant">Easier on eyes</p>
                </div>
              </div>
              <div class="w-10 sm:w-12 h-5 sm:h-6 ${darkEnabled ? 'bg-primary-container' : 'bg-surface-variant'} rounded-full relative transition-colors">
                <div class="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${darkEnabled ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}"></div>
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

    document.querySelector('#toggle-sound')?.addEventListener('click', () => {
      this.settings.sound = !this.settings.sound;
      setSoundEnabled(this.settings.sound);
      localStorage.setItem('sound', this.settings.sound);
      this.renderSettings();
    });

    document.querySelector('#toggle-haptics')?.addEventListener('click', () => {
      this.settings.haptics = !this.settings.haptics;
      localStorage.setItem('haptics', this.settings.haptics);
      this.renderSettings();
    });

    document.querySelector('#toggle-dark')?.addEventListener('click', () => {
      this.settings.darkMode = !this.settings.darkMode;
      this.toggleDarkMode(this.settings.darkMode);
      this.renderSettings();
    });
  }

  goToHome() {
    this.state.view = 'start';
    this.render();
  }
}

new Game();