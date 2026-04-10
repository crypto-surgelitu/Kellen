import { Leaderboard } from './Leaderboard';

/**
 * Catch My Love - GameOver Component (Premium Overhaul)
 */

export class GameOver {
  constructor(container, score, onRestart, onHome) {
    this.container = container;
    this.score = score;
    this.onRestart = onRestart;
    this.onHome = onHome;
    
    this.phrases = [
      "Sweet effort! You spread a lot of joy.",
      "Your heart was too full today! Try again?",
      "Love is a marathon, not a sprint. Take a breath!",
      "Even the best catchers miss a beat sometimes.",
      "There's more love where that came from!",
      "A minor heartbreak only makes you stronger!",
      "Simply Irresistible! Keep catching the love.",
      "You've got a heart of gold! Go again?"
    ];

    this.render();
  }

  getRandomPhrase() {
    const lastPhrase = localStorage.getItem('last_fail_phrase');
    let available = this.phrases.filter(p => p !== lastPhrase);
    const selected = available[Math.floor(Math.random() * available.length)];
    localStorage.setItem('last_fail_phrase', selected);
    return selected;
  }

  render() {
    const phrase = this.getRandomPhrase();
    
    // UI matches the high-fidelity mock provided by the user
    this.container.innerHTML = `
      <div id="game-over-overlay" class="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
        
        <!-- Background Layer with Gradient and Blur -->
        <div class="absolute inset-0 z-0">
          <div class="w-full h-full bg-gradient-to-br from-[#fbf6f1] via-[#f5f0eb] to-[#e1dcd6] opacity-90"></div>
          <div class="absolute inset-0 bg-surface-dim/40 backdrop-blur-sm"></div>
        </div>

        <!-- Decorative Floating Icons -->
        <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-[5] overflow-hidden opacity-20">
          <div class="absolute top-1/4 left-[10%] material-symbols-outlined text-6xl rotate-12 text-primary">favorite</div>
          <div class="absolute bottom-1/4 right-[15%] material-symbols-outlined text-7xl -rotate-12 text-secondary">star</div>
          <div class="absolute top-2/3 left-[20%] material-symbols-outlined text-4xl rotate-45 text-tertiary-fixed">bolt</div>
        </div>

        <!-- Main Card -->
        <div class="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-[0_40px_40px_rgba(168,39,90,0.06)] border border-outline-variant/15 flex flex-col items-center text-center animate-soft-spring">
          
          <!-- Icon Header -->
          <div class="mb-6 relative">
            <div class="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(168,39,90,0.2)]">
              <span class="material-symbols-outlined text-on-primary-container text-5xl" style="font-variation-settings: 'FILL' 1;">heart_broken</span>
            </div>
            <div class="absolute -top-2 -right-2 w-10 h-10 bg-tertiary-container rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <span class="material-symbols-outlined text-on-tertiary-container text-xl" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
          </div>

          <h1 class="font-headline font-extrabold text-4xl text-primary tracking-tight mb-2 uppercase">
            Game Over
          </h1>
          <p class="font-label text-on-surface-variant text-lg mb-8">
            ${phrase}
          </p>

          <!-- Score Section -->
          <div class="w-full bg-surface-container-low rounded-lg p-6 mb-10 relative overflow-hidden group">
            <div class="relative z-10">
              <p class="font-label text-on-surface-variant uppercase tracking-widest text-xs font-bold mb-1">Final Score</p>
              <div class="font-headline text-6xl font-black text-primary flex items-center justify-center gap-2">
                ${this.score}
                <span class="material-symbols-outlined text-tertiary-fixed text-4xl" style="font-variation-settings: 'FILL' 1;">favorite</span>
              </div>
            </div>
            <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span class="material-symbols-outlined text-8xl">favorite</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col w-full gap-4">
            <button id="retry-btn" class="w-full py-4 px-8 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg shadow-[0_8px_20px_rgba(168,39,90,0.3)] hover:scale-105 active:scale-95 transition-all duration-400 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">replay</span>
              Retry
            </button>
            <div class="grid grid-cols-2 gap-4">
              <button id="home-btn" class="w-full py-4 px-4 rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-400 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">home</span>
                Home
              </button>
              <button id="leaderboard-btn" class="w-full py-4 px-4 rounded-full bg-surface-container-high text-on-surface font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-400 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">leaderboard</span>
                Ranks
              </button>
            </div>
          </div>

          <!-- Quick Stats Row (Placeholder for Supabase Sync) -->
          <div class="mt-8 flex gap-6">
            <div class="flex flex-col items-center">
              <span class="font-headline font-bold text-on-surface">12</span>
              <span class="font-label text-on-surface-variant text-[10px] uppercase">Level</span>
            </div>
            <div class="w-px h-8 bg-outline-variant/30"></div>
            <div class="flex flex-col items-center">
              <span class="font-headline font-bold text-on-surface">1,240</span>
              <span class="font-label text-on-surface-variant text-[10px] uppercase">Total XP</span>
            </div>
            <div class="w-px h-8 bg-outline-variant/30"></div>
            <div class="flex flex-col items-center">
              <span class="font-headline font-bold text-on-surface">#42</span>
              <span class="font-label text-on-surface-variant text-[10px] uppercase">Rank</span>
            </div>
          </div>
        </div>

        <!-- Leaderboard Modal Overlay (Hidden by default) -->
        <div id="leaderboard-modal" class="hidden fixed inset-0 z-[110] bg-surface/95 backdrop-blur-2xl flex flex-col p-6 animate-soft-spring">
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-headline font-black text-primary italic">Hall of Love</h2>
            <button id="close-leaderboard" class="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center active:scale-90 transition-all">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>
          <div id="leaderboard-content" class="flex-1 overflow-y-auto w-full max-w-lg mx-auto">
            <!-- Leaderboard injected here -->
          </div>
        </div>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-surface-container-high/40 backdrop-blur-md rounded-full border border-white/20">
          <span class="material-symbols-outlined text-primary text-sm">info</span>
          <span class="font-label text-on-surface-variant text-xs">Score recorded to global leaderboard</span>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    document.querySelector('#retry-btn').addEventListener('click', () => {
      this.onRestart();
    });

    document.querySelector('#home-btn').addEventListener('click', () => {
      this.onHome();
    });

    const modal = document.querySelector('#leaderboard-modal');
    const lbBtn = document.querySelector('#leaderboard-btn');
    const closeBtn = document.querySelector('#close-leaderboard');

    lbBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      const lbContent = document.querySelector('#leaderboard-content');
      new Leaderboard(lbContent);
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}
