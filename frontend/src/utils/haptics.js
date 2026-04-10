/**
 * Catch My Love - Haptics Utility
 */

export const triggerHaptic = (type = 'light') => {
  if (!navigator.vibrate) return;

  switch (type) {
    case 'light':
      navigator.vibrate(10);
      break;
    case 'medium':
      navigator.vibrate(30);
      break;
    case 'heavy':
      navigator.vibrate([50, 30, 50]);
      break;
    default:
      navigator.vibrate(20);
  }
};
