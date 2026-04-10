/**
 * Catch My Love - Bucket Entity
 */

export class Bucket {
  constructor(parent) {
    this.parent = parent;
    this.width = 100;
    this.height = 40;
    this.x = window.innerWidth / 2 - this.width / 2;
    this.y = window.innerHeight - 80;
    this.el = null;
    
    this.create();
  }

  create() {
    this.el = document.createElement('div');
    this.el.id = 'bucket';
    this.el.className = 'absolute z-30 transition-all duration-75 ease-out';
    
    // Styled Pill Shape with Ambient Glow
    this.el.style.width = `${this.width}px`;
    this.el.style.height = `${this.height}px`;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    
    this.el.innerHTML = `
      <div class="w-full h-full bg-gradient-to-b from-primary-container to-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center">
        <span class="text-xl">🧺</span>
      </div>
    `;
    
    this.parent.appendChild(this.el);
  }

  moveTo(x) {
    // Clamp within screen bounds
    const margin = 10;
    const minX = margin;
    const maxX = window.innerWidth - this.width - margin;
    
    this.x = Math.max(minX, Math.min(maxX, x));
    this.el.style.left = `${this.x}px`;
  }
}
