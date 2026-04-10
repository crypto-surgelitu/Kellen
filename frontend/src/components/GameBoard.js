import { FallingHeart } from './FallingHeart';
import { Bucket } from './Bucket';
import { GameOver } from './GameOver';
import { HEART_TYPES, GAME_PHYSICS, AFFECTION_MESSAGES } from '../utils/constants';
import { checkCollision } from '../utils/collision';
import { triggerHaptic } from '../utils/haptics';

export class GameBoard {
  constructor(container, gameState, onHome) {
    this.container = container;
    this.state = gameState;
    this.onHome = onHome;
    this.bounds = { width: 0, height: 0 };
    this.hearts = [];
    this.bucket = null;
    this.isPaused = false;
    this.lastSpawnTime = 0;
    this.missCount = 0;
    this.combo = 1;
    this.showPopup = false;

    this.init();
  }

  init() {
    this.updateBounds();
    this.render();
  }

  start() {
    this.setupInput();
    this.startLoop();
  }

  updateBounds() {
    this.bounds = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  render() {
    this.container.innerHTML = `
      <div class="fixed inset-0 z-0 vibrant-gradient-bg opacity-20"></div>
      
      <header class="flex justify-between items-center w-full px-6 py-4 absolute z-50 bg-transparent">
        <div class="text-2xl font-black text-[#a8275a] italic font-headline">Catch My Love</div>
        <div class="flex gap-4">
          <button id="favorites-btn" class="text-[#5d5b58] hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <span class="material-symbols-outlined" data-icon="favorite">favorite</span>
          </button>
          <button id="game-settings-btn" class="text-[#5d5b58] hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <span class="material-symbols-outlined" data-icon="settings">settings</span>
          </button>
        </div>
      </header>

      <main class="relative h-full w-full bg-surface-container overflow-hidden flex flex-col">
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-20 left-10 w-64 h-64 bg-primary-container rounded-full blur-[120px]"></div>
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary-container rounded-full blur-[140px]"></div>
        </div>

        <div class="relative z-40 px-6 pt-20 flex justify-between items-start w-full">
          <div class="flex flex-col gap-3">
            <div class="bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-lg shadow-[40px_0_40px_rgba(168,39,90,0.06)] flex items-center gap-4">
              <div class="w-12 h-12 bg-primary flex items-center justify-center rounded-full">
                <span class="material-symbols-outlined text-white" data-icon="favorite" style="font-variation-settings: 'FILL' 1;">favorite</span>
              </div>
              <div>
                <div class="text-on-surface-variant font-label text-xs uppercase tracking-widest">Score</div>
                <div id="score-display" class="text-2xl font-black text-primary font-headline">${this.state.score.toLocaleString()}</div>
              </div>
            </div>
            <div class="bg-surface-container-lowest/80 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-3">
              <span class="text-on-surface-variant font-medium text-sm">Level ${this.state.level} Heart Seeker</span>
            </div>
          </div>

          <div class="w-48 bg-surface-container-lowest/80 backdrop-blur-xl p-4 rounded-lg shadow-[40px_0_40px_rgba(168,39,90,0.06)]">
            <div class="flex justify-between items-center mb-2">
              <span class="font-label text-xs text-on-surface-variant font-bold uppercase">Combo</span>
              <span id="combo-display" class="text-secondary font-bold">x${this.combo}</span>
            </div>
            <div class="h-3 w-full bg-secondary-container rounded-full overflow-hidden relative">
              <div id="progress-bar" class="h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full w-[0%] relative">
                <div class="absolute right-0 top-0 h-full w-2 bg-white/40 blur-[2px]"></div>
              </div>
            </div>
          </div>
        </div>

        <div id="play-area" class="absolute inset-0 pointer-events-none z-20">
        </div>

        <div id="interaction-layer" class="absolute inset-0 z-30">
        </div>

        <div id="message-container" class="absolute bottom-24 left-0 w-full px-6 pointer-events-none z-50">
        </div>
      </main>

      ${this.showPopup ? this.renderPopup() : ''}
    `;

    const interactionLayer = document.querySelector('#interaction-layer');
    this.bucket = new Bucket(interactionLayer);

    document.querySelector('#favorites-btn')?.addEventListener('click', () => {
      console.log('Favorites clicked');
    });

    document.querySelector('#game-settings-btn')?.addEventListener('click', () => {
      this.isPaused = !this.isPaused;
    });
  }

  renderPopup() {
    return `
      <div class="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-surface/40 backdrop-blur-sm">
        <div class="max-w-sm w-full bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(168,39,90,0.12)] p-8 relative overflow-hidden flex flex-col items-center text-center transform scale-100 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-6xl" data-icon="favorite">favorite</span>
          </div>
          <div class="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-primary text-4xl" data-icon="celebration" style="font-variation-settings: 'FILL' 1;">celebration</span>
          </div>
          <h2 class="text-3xl font-black text-primary font-headline mb-3 leading-tight">
            You're amazing! 💕
          </h2>
          <p class="text-on-surface-variant font-body mb-8 leading-relaxed">
            You just hit a 10-heart streak! Your rhythm is perfectly in sync with the beats. Keep going!
          </p>
          <div class="flex flex-col w-full gap-3">
            <button id="continue-btn" class="w-full py-4 px-8 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              Continue Playing
            </button>
            <button id="stats-btn" class="w-full py-3 px-8 text-primary font-medium hover:bg-surface-container-low rounded-xl transition-colors">
              View Stats
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setupInput() {
    if (this.inputSetupDone) return;

    const handleMove = (e) => {
      if (this.isPaused || !this.bucket) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      this.bucket.moveTo(clientX - this.bucket.width / 2);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    this.inputSetupDone = true;
  }

  startLoop() {
    if (this.loopStarted) return;
    this.loopStarted = true;

    const loop = (time) => {
      if (this.isPaused) {
        requestAnimationFrame(loop);
        return;
      }
      this.update(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(time) {
    if (!this.lastSpawnTime) this.lastSpawnTime = time;

    const difficultyReduction = Math.min((this.state.level - 1) * 150, 850);
    const currentInterval = Math.max(GAME_PHYSICS.SPAWN_INTERVAL - difficultyReduction, 350);

    if (time - this.lastSpawnTime > currentInterval) {
      this.spawnHeart();
      this.lastSpawnTime = time;
    }

    this.hearts = this.hearts.filter(heart => {
      heart.update();

      if (this.bucket && checkCollision(heart, this.bucket)) {
        this.handleCatch(heart);
        return false;
      }

      if (!heart.isActive) {
        if (heart.type.score > 0) {
          this.missCount++;
          this.combo = 1;
          if (this.missCount > 2) {
            this.state.lives--;
            triggerHaptic('heavy');
            this.updateHUD();
          }
        }
        return false;
      }
      return true;
    });
  }

  spawnHeart() {
    const rand = Math.random();
    let type = HEART_TYPES.NORMAL;

    if (rand < HEART_TYPES.GOLDEN.spawnChance) {
      type = HEART_TYPES.GOLDEN;
    } else if (rand < HEART_TYPES.GOLDEN.spawnChance + HEART_TYPES.HEARTBREAK.spawnChance) {
      type = HEART_TYPES.HEARTBREAK;
    }

    const margin = 20;
    const x = Math.random() * (this.bounds.width - margin * 2) + margin;
    const speed = GAME_PHYSICS.INITIAL_SPEED + (this.state.level * 0.8);

    this.hearts.push(new FallingHeart(type, x, speed));
  }

  handleCatch(heart) {
    this.state.score += heart.type.score * this.combo;
    if (this.state.score < 0) this.state.score = 0;

    if (heart.type.lives) {
      this.state.lives += heart.type.lives;
      triggerHaptic(heart.type.lives < 0 ? 'heavy' : 'medium');
    } else {
      triggerHaptic('light');
    }

    this.combo = Math.min(this.combo + 1, 10);

    const previousLevel = this.state.level;
    this.state.level = Math.floor(this.state.score / 100) + 1;
    if (this.state.level > previousLevel) {
      this.triggerLevelUpFlash();
    }

    if (this.combo === 10 && !this.showPopup) {
      this.showPopup = true;
      this.render();
      this.setupPopupListeners();
    } else {
      this.updateHUD();
    }

    this.showAffectionPopup(heart);
    heart.destroy();
  }

  setupPopupListeners() {
    document.querySelector('#continue-btn')?.addEventListener('click', () => {
      this.showPopup = false;
      this.isPaused = false;
      this.render();
    });

    document.querySelector('#stats-btn')?.addEventListener('click', () => {
      console.log('View stats');
    });
  }

  triggerLevelUpFlash() {
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 z-[200] bg-white pointer-events-none animate-flash';
    document.body.appendChild(flash);

    setTimeout(() => {
      if (flash.parentNode) flash.parentNode.removeChild(flash);
    }, 1000);
  }

  updateHUD() {
    const scoreElem = document.querySelector('#score-display');
    if (scoreElem) scoreElem.textContent = this.state.score.toLocaleString();

    const comboElem = document.querySelector('#combo-display');
    if (comboElem) comboElem.textContent = `x${this.combo}`;

    const progress = (this.state.score % 100);
    const bar = document.querySelector('#progress-bar');
    if (bar) bar.style.width = `${progress}%`;

    if (this.state.lives <= 0) {
      this.gameOver();
    }
  }

  showAffectionPopup(heart) {
    let msgList = AFFECTION_MESSAGES.SWEET;
    if (heart.type.type === 'GOLDEN') msgList = AFFECTION_MESSAGES.AFFECTIONATE;
    if (this.state.score % 50 === 0) msgList = AFFECTION_MESSAGES.FLIRTY;

    const text = msgList[Math.floor(Math.random() * msgList.length)];
    const popup = document.createElement('div');

    popup.className = 'absolute font-display font-bold text-lg pointer-events-none animate-popup-rise z-50 shadow-sm';
    popup.style.left = `${heart.x}px`;
    popup.style.top = `${heart.y}px`;

    popup.style.color = heart.type.type === 'GOLDEN' ? 'var(--color-tertiary)' : 'var(--color-primary)';
    popup.textContent = text;

    document.querySelector('#play-area').appendChild(popup);

    setTimeout(() => {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 1500);
  }

  gameOver() {
    this.isPaused = true;
    new GameOver(
      this.container,
      this.state.score,
      () => {
        this.resetInternalState();
        this.init();
      },
      () => {
        this.resetInternalState();
        if (this.onHome) this.onHome();
      }
    );
  }

  resetInternalState() {
    this.state.score = 0;
    this.state.lives = 6;
    this.state.level = 1;
    this.missCount = 0;
    this.hearts = [];
    this.lastSpawnTime = 0;
    this.isPaused = false;
    this.combo = 1;
    this.showPopup = false;
  }
}