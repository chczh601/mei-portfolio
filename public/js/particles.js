// Particle system for text animation effects
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.text = 'Mei';
        this.textSize = 120;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticlesFromText();
        this.setupEventListeners();
        this.animate();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticlesFromText() {
        this.ctx.font = `${this.textSize}px 'Inter', sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Get text metrics
        const textMetrics = this.ctx.measureText(this.text);
        const textX = this.canvas.width / 2;
        const textY = this.canvas.height / 2;
        
        // Draw text to canvas to get pixel data
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillText(this.text, textX, textY);
        
        // Get image data and create particles
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        this.particles = [];
        const particleSize = 3;
        const spacing = 4;
        
        for (let y = 0; y < this.canvas.height; y += spacing) {
            for (let x = 0; x < this.canvas.width; x += spacing) {
                const index = (y * this.canvas.width + x) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 128) {
                    this.particles.push({
                        x: x,
                        y: y,
                        originalX: x,
                        originalY: y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        size: particleSize,
                        color: this.getRandomColor(),
                        life: 1,
                        decay: 0.01
                    });
                }
            }
        }
    }
    
    getRandomColor() {
        const colors = [
            '#B6DDDC', // Core color
            '#8CC8C6', // Lighter version
            '#5BA7A5', // Darker version
            '#3A8E8C', // Even darker
            '#2D7170'  // Dark green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        // Resize canvas when window size changes
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticlesFromText();
        });
        
        // Mouse interaction
        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Click to trigger animation
        this.canvas.addEventListener('click', () => {
            this.triggerAnimation();
        });
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                const force = (50 - distance) / 50;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force;
                particle.vy -= Math.sin(angle) * force;
            }
        });
    }
    
    triggerAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.particles.forEach(particle => {
            // Random explosion direction
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 5 + 2;
            particle.vx = Math.cos(angle) * force;
            particle.vy = Math.sin(angle) * force;
            particle.decay = 0.02;
        });
        
        // Reorganize after animation
        setTimeout(() => {
            this.reorganizeParticles();
        }, 2000);
    }
    
    reorganizeParticles() {
        this.particles.forEach(particle => {
            // Calculate direction to original position
            const dx = particle.originalX - particle.x;
            const dy = particle.originalY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 1) {
                particle.vx = dx * 0.05;
                particle.vy = dy * 0.05;
            } else {
                particle.vx = 0;
                particle.vy = 0;
                particle.x = particle.originalX;
                particle.y = particle.originalY;
            }
        });
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 2000);
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Add slight gravity
            particle.vy += 0.05;
            
            // Add friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.5;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.5;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Life decay
            if (this.isAnimating) {
                particle.life -= particle.decay;
                if (particle.life <= 0) {
                    particle.life = 0;
                }
            } else {
                particle.life = 1;
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods
    setText(newText) {
        this.text = newText;
        this.createParticlesFromText();
    }
    
    setTextSize(size) {
        this.textSize = size;
        this.createParticlesFromText();
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.particle-canvas');
    if (canvas) {
        const particleSystem = new ParticleSystem(canvas);
        
        // Add to window for debugging (optional)
        window.particleSystem = particleSystem;
    }
});