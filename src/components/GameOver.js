import { Leaderboard } from './Leaderboard';

/**
 * Catch My Love - GameOver Component
 */

export class GameOver {
  constructor(container, score, onRestart) {
    this.container = container;
    this.score = score;
    this.onRestart = onRestart;
    
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div id="game-over" class="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-soft-spring">
        <div class="w-full max-w-md space-y-12">
          
          <div class="space-y-4">
            <h1 class="text-6xl font-display font-bold text-primary">Love's End</h1>
            <p class="text-lg font-body text-on-surface-variant">You caught so much love today!</p>
          </div>

          <div class="flex flex-col items-center">
            <span class="text-xs font-label text-on-surface-variant uppercase tracking-widest">Final Score</span>
            <span class="text-8xl font-display font-bold text-primary">${this.score}</span>
          </div>

          <div id="leaderboard-root" class="w-full">
            <!-- Leaderboard injected here -->
          </div>

          <div class="grid grid-cols-2 gap-4 w-full">
            <button id="restart-btn" class="btn-primary py-5 text-xl">
              Play Again
            </button>
            <button id="share-btn" class="btn-secondary py-5 text-xl flex items-center justify-center gap-2">
              <span>Share</span>
              <span class="text-base">↗️</span>
            </button>
          </div>

        </div>
      </div>
    `;

    // Initialize Leaderboard
    const lbRoot = document.querySelector('#leaderboard-root');
    new Leaderboard(lbRoot);

    // Bind Actions
    document.querySelector('#restart-btn').addEventListener('click', () => {
      this.onRestart();
    });

    document.querySelector('#share-btn').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Catch My Love',
          text: `I just caught ${this.score} hearts in Catch My Love! Can you beat me?`,
          url: window.location.href,
        });
      } else {
        alert('Copied to clipboard!');
      }
    });
  }
}
