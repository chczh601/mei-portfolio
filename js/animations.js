// Simplified scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Add animation classes to all relevant elements
        this.addAnimationClasses();
        
        // Use traditional scroll event listener for better compatibility
        this.setupScrollListener();
    }

    setupScrollListener() {
        const checkAnimations = () => {
            const elements = document.querySelectorAll('.fade-in');
            elements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 100; // Reduced threshold for better visibility
                
                if (elementTop < window.innerHeight - elementVisible) {
                    el.classList.add('visible');
                }
            });
        };

        // Initial check with a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            checkAnimations();
        }, 100);
        
        // Check on scroll
        window.addEventListener('scroll', checkAnimations);
    }

    // Add fade-in class to elements that should animate on scroll
    addAnimationClasses() {
        // Sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.add('fade-in');
        });

        // Cards and containers
        const cards = document.querySelectorAll('.skill-card, .timeline-content, .blog-card');
        cards.forEach(card => {
            card.classList.add('fade-in');
        });

        // Text content
        const textContent = document.querySelectorAll('.about-text, .about-image');
        textContent.forEach(content => {
            content.classList.add('fade-in');
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimations = new ScrollAnimations();
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Parallax effect for hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const scrolled = window.scrollY;
                const rate = scrolled * -0.5;
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }
});