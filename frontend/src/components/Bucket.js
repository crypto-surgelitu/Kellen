/**
 * Catch My Love - Bucket Entity
 * Mobile-responsive bucket that moves horizontally AND vertically
 */

export class Bucket {
  constructor(parent) {
    this.parent = parent;
    this.width = this.getResponsiveWidth();
    this.height = this.getResponsiveHeight();
    this.x = window.innerWidth / 2 - this.width / 2;
    this.y = window.innerHeight - this.height - 60;
    this.el = null;
    this.isDragging = false;
    this.dragStartY = 0;
    
    this.create();
    this.updatePosition();
  }

  getResponsiveWidth() {
    const w = window.innerWidth;
    if (w < 380) return 70;
    if (w < 480) return 85;
    return 100;
  }

  getResponsiveHeight() {
    const w = window.innerWidth;
    if (w < 380) return 32;
    if (w < 480) return 36;
    return 40;
  }

  updatePosition() {
    if (this.el) {
      this.el.style.left = `${this.x}px`;
      this.el.style.top = `${this.y}px`;
    }
  }

  create() {
    this.el = document.createElement('div');
    this.el.id = 'bucket';
    this.el.className = 'absolute z-30 select-none';
    
    this.el.style.width = `${this.width}px`;
    this.el.style.height = `${this.height}px`;
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    
    // Interactive touch area for vertical movement
    this.el.style.touchAction = 'none';
    this.el.style.cursor = 'grab';
    
    // Bucket shape - tapered like a real bucket
    this.el.innerHTML = `
      <div class="w-full h-full relative" style="filter: drop-shadow(0 4px 12px rgba(168, 39, 90, 0.4));">
        <!-- Bucket body - tapered shape -->
        <svg viewBox="0 0 100 40" class="w-full h-full">
          <defs>
            <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#E8B4B8;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#C4616A;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="bucketHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#FFF0F1;stop-opacity:0.8" />
              <stop offset="50%" style="stop-color:#E8B4B8;stop-opacity:0" />
              <stop offset="100%" style="stop-color:#A03D4A;stop-opacity:0.6" />
            </linearGradient>
          </defs>
          <!-- Main bucket body -->
          <path d="M10 5 L15 38 Q50 42 85 38 L90 5 Q50 0 10 5 Z" 
                fill="url(#bucketGrad)" 
                stroke="#A03D4A" 
                stroke-width="2"/>
          <!-- Highlight shine -->
          <path d="M18 8 L22 32 Q35 34 40 32 L38 8 Q30 5 18 8 Z" 
                fill="url(#bucketHighlight)" 
                opacity="0.7"/>
          <!-- Handle -->
          <path d="M25 5 Q50 -5 75 5" 
                fill="none" 
                stroke="#8B4452" 
                stroke-width="3" 
                stroke-linecap="round"/>
          <!-- Heart decoration inside -->
          <text x="50" y="28" text-anchor="middle" font-size="16">❤️</text>
        </svg>
      </div>
    `;
    
    this.parent.appendChild(this.el);
  }

  moveTo(x, y = null) {
    // Horizontal bounds
    const margin = 8;
    const minX = margin;
    const maxX = window.innerWidth - this.width - margin;
    
    this.x = Math.max(minX, Math.min(maxX, x));
    this.el.style.left = `${this.x}px`;
    
    // Vertical movement (if y provided)
    if (y !== null) {
      const vertMargin = 100;
      const minY = vertMargin;
      const maxY = window.innerHeight - this.height - 50;
      
      this.y = Math.max(minY, Math.min(maxY, y));
      this.el.style.top = `${this.y}px`;
    }
  }

  moveVertical(deltaY) {
    const vertMargin = 100;
    const minY = vertMargin;
    const maxY = window.innerHeight - this.height - 50;
    
    this.y += deltaY;
    this.y = Math.max(minY, Math.min(maxY, this.y));
    this.el.style.top = `${this.y}px`;
  }
}
