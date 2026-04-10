/**
 * Catch My Love - GameBoard Component
 */

export class GameBoard {
  constructor(container, gameState) {
    this.container = container;
    this.state = gameState;
    this.bounds = { width: 0, height: 0 };
    
    this.init();
  }

  init() {
    this.updateBounds();
    this.render();
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
        <header class="absolute top-0 left-0 w-full p-6 z-10">
          <div class="glass-hud flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-label text-on-surface-variant uppercase tracking-wider">Score</span>
              <span id="score-display" class="text-3xl font-display font-bold text-primary">${this.state.score}</span>
            </div>
            
            <div class="flex flex-col items-end">
              <span class="text-xs font-label text-on-surface-variant uppercase tracking-wider">Hearts</span>
              <div id="lives-display" class="flex gap-1 text-2xl">
                ${'❤️'.repeat(this.state.lives)}
              </div>
            </div>
          </div>
          
          <!-- Catch Meter: Progress Bar -->
          <div class="mt-4 px-2">
            <span class="text-[10px] font-label text-on-surface-variant uppercase tracking-widest block mb-1">Catch Meter</span>
            <div class="h-2 w-full bg-secondary-container rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500" style="width: 10%"></div>
            </div>
          </div>
        </header>

        <!-- Dynamic Game Surface -->
        <main id="play-area" class="relative w-full h-full">
          <!-- Bucket and Hearts will be rendered here in Phase 3/4 -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl opacity-20">
            🗑️
          </div>
        </main>

        <!-- Message Overlay Area -->
        <div id="message-container" class="absolute bottom-24 left-0 w-full px-6 pointer-events-none">
          <!-- Messages will pop up here -->
        </div>

      </div>
    `;
  }

  updateScore(newScore) {
    this.state.score = newScore;
    const scoreElem = document.querySelector('#score-display');
    if (scoreElem) scoreElem.textContent = newScore;
    
    // Update progress bar based on level/score ratio
    const progress = (newScore % 50) * 2; // Example logic: level up every 50 points
    const bar = document.querySelector('#progress-bar');
    if (bar) bar.style.width = `${progress}%`;
  }

  updateLives(newLives) {
    this.state.lives = newLives;
    const livesElem = document.querySelector('#lives-display');
    if (livesElem) livesElem.innerHTML = '❤️'.repeat(newLives);
  }
}
