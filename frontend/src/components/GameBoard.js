import { FallingHeart } from './FallingHeart';
import { Bucket } from './Bucket';
import { GameOver } from './GameOver';
import { HEART_TYPES, GAME_PHYSICS, AFFECTION_MESSAGES } from '../utils/constants';
import { checkCollision } from '../utils/collision';
import { triggerHaptic } from '../utils/haptics';

/**
 * Catch My Love - GameBoard Component
 */

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
      <div id="game-board" class="relative w-full h-full animate-soft-spring overflow-hidden bg-surface">
        
        <!-- HUD: High-End Glassmorphism UI -->
        <header class="absolute top-0 left-0 w-full p-6 z-40">
          <div class="glass-hud flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-label text-on-surface-variant uppercase tracking-wider">Score</span>
              <span id="score-display" class="text-3xl font-display font-bold text-primary">${this.state.score}</span>
            </div>
            
            <div class="flex flex-col items-end">
              <span class="text-xs font-label text-on-surface-variant uppercase tracking-wider">Hearts</span>
              <div id="lives-display" class="flex gap-1 text-2xl text-primary">
                ${'❤️'.repeat(this.state.lives)}
              </div>
            </div>
          </div>
          
          <!-- Catch Meter: Progress Bar -->
          <div class="mt-4 px-2">
            <span class="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-1">Catch Meter</span>
            <div class="h-2 w-full bg-secondary-container rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </header>

        <!-- Dynamic Game Surface -->
        <main id="play-area" class="relative w-full h-full pointer-events-none z-20">
          <!-- Hearts rendered here -->
        </main>

        <!-- Bucket Parent Area (Interaction Layer) -->
        <div id="interaction-layer" class="absolute inset-0 z-30">
          <!-- Bucket will be spawned here -->
        </div>

        <!-- Message Overlay Area -->
        <div id="message-container" class="absolute bottom-24 left-0 w-full px-6 pointer-events-none z-50">
        </div>

      </div>
    `;

    const interactionLayer = document.querySelector('#interaction-layer');
    this.bucket = new Bucket(interactionLayer);
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
      if (this.isPaused) return;
      this.update(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(time) {
    if (!this.lastSpawnTime) this.lastSpawnTime = time;

    // Spawning logic - Progressive difficulty
    const difficultyReduction = Math.min((this.state.level - 1) * 150, 850);
    const currentInterval = Math.max(GAME_PHYSICS.SPAWN_INTERVAL - difficultyReduction, 350);
    
    if (time - this.lastSpawnTime > currentInterval) {
      this.spawnHeart();
      this.lastSpawnTime = time;
    }

    // Update hearts
    this.hearts = this.hearts.filter(heart => {
      heart.update();
      
      if (this.bucket && checkCollision(heart, this.bucket)) {
        this.handleCatch(heart);
        return false;
      }
      
      if (!heart.isActive) {
        // Only count as a "miss" if it's a positive heart (Normal or Golden)
        if (heart.type.score > 0) {
          this.missCount++;
          if (this.missCount > 2) {
            this.state.lives--;
            this.missCount = 0;
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

    const margin = 20; // Reduced margin for better mobile play
    const x = Math.random() * (this.bounds.width - margin * 2) + margin;
    const speed = GAME_PHYSICS.INITIAL_SPEED + (this.state.level * 0.8);

    this.hearts.push(new FallingHeart(type, x, speed));
  }

  handleCatch(heart) {
    // Update State
    this.state.score += heart.type.score;
    if (this.state.score < 0) this.state.score = 0;

    if (heart.type.lives) {
      this.state.lives += heart.type.lives;
      triggerHaptic(heart.type.lives < 0 ? 'heavy' : 'medium');
    } else {
      triggerHaptic('light');
    }

    // Progression
    const previousLevel = this.state.level;
    this.state.level = Math.floor(this.state.score / 100) + 1;
    if (this.state.level > previousLevel) {
      this.triggerLevelUpFlash();
    }

    this.updateHUD();
    this.showAffectionPopup(heart);
    heart.destroy();
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
    if (scoreElem) scoreElem.textContent = this.state.score;
    
    const livesElem = document.querySelector('#lives-display');
    if (livesElem) {
      livesElem.innerHTML = '❤️'.repeat(Math.max(0, this.state.lives));
      // Visual indicator for misses
      if (this.missCount > 0) {
        livesElem.innerHTML += `<span class="text-on-surface-variant/30 ml-2 text-sm font-label uppercase">Miss: ${this.missCount}/3</span>`;
      }
    }
    
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
    
    // Append to play-area instead of message-container for correct absolute positioning
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
        // Reset State for Restart
        this.resetInternalState();
        this.init();
      },
      () => {
        // Clean up and go Home
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
  }

}
