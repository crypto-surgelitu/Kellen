/**
 * Catch My Love - Collision Utility
 */

export const checkCollision = (heart, bucket) => {
  // heart instance has x, y and some radius (approx 20px for 4xl emoji)
  // bucket has x, y, width, height
  
  const heartBounds = {
    x: heart.x,
    y: heart.y,
    size: 40 // approx diameter
  };
  
  // Basic AABB / Circle collision
  const isColliding = 
    heartBounds.x + heartBounds.size > bucket.x &&
    heartBounds.x < bucket.x + bucket.width &&
    heartBounds.y + heartBounds.size > bucket.y &&
    heartBounds.y < bucket.y + bucket.height;
    
  return isColliding;
};
