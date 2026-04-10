import { apiClient } from '../api/client';

/**
 * Catch My Love - Leaderboard Component
 */

export class Leaderboard {
  constructor(parent) {
    this.parent = parent;
    this.scores = [];
    
    this.init();
  }

  async init() {
    this.renderLoading();
    const data = await apiClient.getConfig(); // Reusing config call as placeholder or assuming a scores call
    // In a real app, we'd have a specific scores endpoint
    this.scores = [
      { name: "Heartbreaker", score: 1250 },
      { name: "Cupid", score: 980 },
      { name: "Sweetie", score: 850 },
      { name: "LoveBug", score: 720 },
      { name: "Romeo", score: 450 }
    ];
    this.render();
  }

  renderLoading() {
    this.parent.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 space-y-4">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="font-label text-on-surface-variant">Fetching Hall of Love...</p>
      </div>
    `;
  }

  render() {
    this.parent.innerHTML = `
      <div class="w-full max-w-sm mx-auto space-y-6 animate-soft-spring">
        <h3 class="text-2xl font-display font-bold text-center text-primary">Hall of Love</h3>
        
        <div class="bg-surface-container-low rounded-[32px] overflow-hidden p-2">
          <ul class="divide-y divide-white/10">
            ${this.scores.map((s, i) => `
              <li class="flex items-center justify-between p-4 ${i === 0 ? 'bg-primary/5' : ''}">
                <div class="flex items-center gap-4">
                  <span class="font-display font-bold w-6 text-on-surface-variant/40">${i + 1}</span>
                  <span class="font-body font-medium text-on-surface ">${s.name}</span>
                </div>
                <span class="font-display font-bold text-primary">${s.score}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}
