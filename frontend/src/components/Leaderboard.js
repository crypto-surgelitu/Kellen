import { apiClient } from '../api/client';

export class Leaderboard {
  constructor(parent, currentUser) {
    this.parent = parent;
    this.currentUser = currentUser;
    this.score = currentUser.hearts || 4200;

    this.init();
  }

  async init() {
    this.render();
  }

  render() {
    this.parent.innerHTML = `
      <div class="flex flex-col items-center p-6 space-y-4 animate-soft-spring">
        <div class="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center mb-2">
          <img src="${this.currentUser.avatar}" alt="Profile" class="w-16 h-16 rounded-full object-cover border-2 border-primary-container"/>
        </div>
        
        <div class="text-center">
          <h3 class="text-2xl font-black text-primary font-headline">${this.currentUser.name}</h3>
          <p class="text-on-surface-variant font-label">Level ${this.currentUser.level} Heart Seeker</p>
        </div>

        <div class="w-full bg-surface-container-low rounded-xl p-6 mt-4">
          <div class="text-center">
            <div class="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2">Your Score</div>
            <div class="text-4xl font-black text-primary font-headline">${this.score.toLocaleString()}</div>
            <div class="text-secondary text-sm font-medium mt-2">Hearts Collected</div>
          </div>
        </div>

        <div class="text-center mt-4">
          <p class="text-on-surface-variant text-sm">Play more to climb the rankings!</p>
        </div>
      </div>
    `;
  }
}