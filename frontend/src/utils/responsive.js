/**
 * Catch My Love - Responsive Layout Utility
 */

export const getGameBounds = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Mobile-first: Full width/height is preferred
  // but we should defined a "safe area" for the bucket and hearts
  
  return {
    width,
    height,
    safeWidth: width,
    safeHeight: height - 100, // Reserve 100px for HUD
    isMobile: width < 768,
  };
};

export const setupResponsiveHandler = (callback) => {
  window.addEventListener('resize', () => {
    callback(getGameBounds());
  });
};
