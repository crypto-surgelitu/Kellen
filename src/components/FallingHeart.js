/**
 * Catch My Love - FallingHeart Entity
 */

export class FallingHeart {
  constructor(type, x, speed) {
    this.type = type;
    this.x = x;
    this.y = -50; // Start off-screen
    this.speed = speed * type.speedMultiplier;
    this.el = null;
    this.isActive = true;
    
    this.create();
  }

  create() {
    this.el = document.createElement('div');
    this.el.className = 'absolute text-4xl select-none pointer-events-none transition-transform duration-100 linear';
    this.el.innerHTML = this.type.symbol;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    
    // Add custom style for golden hearts
    if (this.type.type === 'GOLDEN') {
      this.el.classList.add('drop-shadow-[0_0_10px_rgba(255,215,9,0.5)]');
    }
    
    document.querySelector('#play-area').appendChild(this.el);
  }

  update() {
    if (!this.isActive) return;
    
    this.y += this.speed;
    this.el.style.transform = `translateY(${this.y}px)`;
    
    // Check if out of bounds
    if (this.y > window.innerHeight + 50) {
      this.destroy();
    }
  }

  destroy() {
    this.isActive = false;
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
