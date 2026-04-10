/**
 * Catch My Love - Game Constants
 */

export const HEART_TYPES = {
  NORMAL: {
    type: 'NORMAL',
    symbol: '❤️',
    score: 10,
    speedMultiplier: 1.0,
    spawnChance: 0.8,
  },
  GOLDEN: {
    type: 'GOLDEN',
    symbol: '💝',
    score: 50,
    speedMultiplier: 1.4,
    spawnChance: 0.1,
  },
  HEARTBREAK: {
    type: 'HEARTBREAK',
    symbol: '💔',
    score: -20,
    lives: -1,
    speedMultiplier: 1.2,
    spawnChance: 0.1,
  }
};

export const GAME_PHYSICS = {
  INITIAL_GRAVITY: 0.05,
  MAX_GRAVITY: 0.2,
  INITIAL_SPEED: 2,
  MAX_SPEED: 8,
  SPAWN_INTERVAL: 1200, // ms
  MIN_SPAWN_INTERVAL: 400,
};
