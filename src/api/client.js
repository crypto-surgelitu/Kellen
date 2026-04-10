/**
 * Catch My Love - API Client
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export const apiClient = {
  /**
   * Fetch game configuration
   */
  async getConfig() {
    try {
      const response = await fetch(`${API_BASE}/api/config`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn('API: Failed to fetch config, using fallback', error);
      return {
        heartSpeed: 2,
        spawnRate: 1000,
        bucketSpeed: 10,
        difficultyTiers: [
          { score: 0, speed: 2, rate: 1000 },
          { score: 50, speed: 3, rate: 800 },
          { score: 150, speed: 5, rate: 600 },
        ]
      };
    }
  },

  /**
   * Fetch a random affection message
   */
  async getRandomMessage() {
    try {
      const response = await fetch(`${API_BASE}/api/messages`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn('API: Failed to fetch message, using fallback', error);
      const fallbacks = [
        "You're amazing!",
        "Love is in the air!",
        "Keep catching those hearts!",
        "You've got this!",
        "So much love today!"
      ];
      return { message: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
    }
  },

  /**
   * Submit a high score
   */
  async submitScore(playerName, score) {
    try {
      const response = await fetch(`${API_BASE}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score }),
      });
      return await response.json();
    } catch (error) {
      console.error('API: Failed to submit score', error);
      return { success: false, error: error.message };
    }
  }
};
