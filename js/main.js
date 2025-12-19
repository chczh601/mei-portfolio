// Navigation bar scroll effect
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Card hover effects are handled by CSS for better performance and compatibility

// Hero title subtle animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    let angle = 0;
    
    const animateTitle = () => {
        angle += 0.5;
        const x = Math.sin(angle * Math.PI / 180) * 2;
        const y = Math.cos(angle * Math.PI / 180) * 2;
        heroTitle.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animateTitle);
    };
    
    animateTitle();
});

// Blog slider touch support for mobile
document.addEventListener('DOMContentLoaded', () => {
    const blogSlider = document.querySelector('.blog-slider');
    if (!blogSlider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    blogSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        blogSlider.classList.add('active');
        startX = e.pageX - blogSlider.offsetLeft;
        scrollLeft = blogSlider.scrollLeft;
    });
    
    blogSlider.addEventListener('mouseleave', () => {
        isDown = false;
        blogSlider.classList.remove('active');
    });
    
    blogSlider.addEventListener('mouseup', () => {
        isDown = false;
        blogSlider.classList.remove('active');
    });
    
    blogSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - blogSlider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        blogSlider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events
    blogSlider.addEventListener('touchstart', (e) => {
        isDown = true;
        blogSlider.classList.add('active');
        startX = e.touches[0].pageX - blogSlider.offsetLeft;
        scrollLeft = blogSlider.scrollLeft;
    });
    
    blogSlider.addEventListener('touchend', () => {
        isDown = false;
        blogSlider.classList.remove('active');
    });
    
    blogSlider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - blogSlider.offsetLeft;
        const walk = (x - startX) * 2;
        blogSlider.scrollLeft = scrollLeft - walk;
    });
});

// Responsive menu (to be implemented if needed)
// class ResponsiveMenu {
//     constructor() {
//         this.menuToggle = document.querySelector('.menu-toggle');
//         this.navLinks = document.querySelector('.nav-links');
//         this.init();
//     }
//     
//     init() {
//         this.menuToggle.addEventListener('click', () => {
//             this.navLinks.classList.toggle('active');
//         });
//     }
// }

// Initialize responsive menu if toggle exists
// document.addEventListener('DOMContentLoaded', () => {
//     const menuToggle = document.querySelector('.menu-toggle');
//     if (menuToggle) {
//         const responsiveMenu = new ResponsiveMenu();
//     }
// });

// Preload images (if any)
class ImagePreloader {
    constructor() {
        this.init();
    }
    
    init() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.complete) {
                this.onImageLoad(img);
            } else {
                img.addEventListener('load', () => this.onImageLoad(img));
                img.addEventListener('error', () => this.onImageError(img));
            }
        });
    }
    
    onImageLoad(img) {
        img.classList.add('loaded');
    }
    
    onImageError(img) {
        img.classList.add('error');
    }
}

// Initialize image preloader
document.addEventListener('DOMContentLoaded', () => {
    const imagePreloader = new ImagePreloader();
});