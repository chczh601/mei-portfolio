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

// API Base URL
const API_BASE_URL = window.location.origin;

// Blog Data Loader
class BlogLoader {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadBlogPosts();
    }
    
    async loadBlogPosts() {
        try {
            const response = await fetch(API_BASE_URL + '/api/blog');
            const blogPosts = await response.json();
            this.renderBlogPosts(blogPosts);
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        }
    }
    
    renderBlogPosts(blogPosts) {
        const blogSlider = document.querySelector('.blog-slider');
        if (!blogSlider) return;
        
        // Clear existing static content
        blogSlider.innerHTML = '';
        
        // Render dynamic blog posts
        blogPosts.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            
            // Format date
            const date = new Date(post.created_at).toISOString().split('T')[0].replace(/-/g, '.');
            
            // Create blog card content
            blogCard.innerHTML = `
                <div class="blog-image" ${post.image ? `style="background-image: url('uploads/${post.image}')"` : ''}></div>
                <div class="blog-content">
                    <span class="blog-date">${date}</span>
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <a href="#" class="blog-link" onclick="showBlogDetail(${post.id}); return false;">阅读更多 →</a>
                </div>
            `;
            
            blogSlider.appendChild(blogCard);
        });
        
        // If no blog posts, show message
        if (blogPosts.length === 0) {
            blogSlider.innerHTML = '<p style="text-align: center; color: #666; width: 100%; padding: 40px;">暂无博客文章</p>';
        }
    }
}

// Gallery Data Loader
class GalleryLoader {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadGalleryImages();
    }
    
    async loadGalleryImages() {
        try {
            const response = await fetch(API_BASE_URL + '/api/gallery');
            const galleryImages = await response.json();
            this.renderGalleryImages(galleryImages);
        } catch (error) {
            console.error('Failed to load gallery images:', error);
        }
    }
    
    renderGalleryImages(galleryImages) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;
        
        // Clear existing content
        galleryGrid.innerHTML = '';
        
        // Render dynamic gallery images
        galleryImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            // Format date
            const date = new Date(image.created_at).toISOString().split('T')[0].replace(/-/g, '.');
            
            // Create gallery item content
            galleryItem.innerHTML = `
                <div class="gallery-image">
                    <img src="uploads/${image.filename}" alt="${image.caption || 'Gallery Image'}">
                    <div class="gallery-overlay">
                        <p class="gallery-caption">${image.caption || '无描述'}</p>
                        <span class="gallery-date">${date}</span>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // If no gallery images, show message
        if (galleryImages.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; color: #666; width: 100%; padding: 40px;">暂无相册图片</p>';
        }
    }
}

// Messages Handler
class MessagesHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadMessages();
        this.bindFormEvents();
    }
    
    async loadMessages() {
        try {
            const response = await fetch(API_BASE_URL + '/api/messages');
            const messages = await response.json();
            this.renderMessages(messages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }
    
    renderMessages(messages) {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;
        
        // Clear existing content
        messagesList.innerHTML = '';
        
        // Render dynamic messages
        messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            
            // Format date
            const date = new Date(message.created_at).toISOString().split('T')[0].replace(/-/g, '.');
            
            // Create message item content
            messageItem.innerHTML = `
                <div class="message-header">
                    <h4 class="message-name">${message.name}</h4>
                    <span class="message-date">${date}</span>
                    <span class="message-email">${message.email}</span>
                </div>
                <div class="message-content">
                    <p>${message.content}</p>
                </div>
            `;
            
            messagesList.appendChild(messageItem);
        });
        
        // If no messages, show message
        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align: center; color: #666; width: 100%; padding: 40px;">暂无留言</p>';
        }
    }
    
    bindFormEvents() {
        const messageForm = document.getElementById('message-form');
        if (!messageForm) return;
        
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(messageForm);
            const messageData = {
                name: formData.get('name'),
                email: formData.get('email'),
                content: formData.get('content')
            };
            
            try {
                // Submit message to API
                const response = await fetch(API_BASE_URL + '/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });
                
                const result = await response.json();
                
                if (result.message === 'Message sent successfully') {
                    // Show success message
                    alert('留言发送成功！');
                    
                    // Clear form
                    messageForm.reset();
                    
                    // Reload messages to show the new one
                    this.loadMessages();
                } else {
                    alert('留言发送失败，请重试。');
                }
            } catch (error) {
                console.error('Failed to send message:', error);
                alert('留言发送失败，请检查网络连接。');
            }
        });
    }
}

// Initialize image preloader, blog loader, gallery loader, and messages handler
document.addEventListener('DOMContentLoaded', () => {
    const imagePreloader = new ImagePreloader();
    const blogLoader = new BlogLoader();
    const galleryLoader = new GalleryLoader();
    const messagesHandler = new MessagesHandler();
});

// Blog Detail Modal
async function showBlogDetail(postId) {
    try {
        const response = await fetch(API_BASE_URL + `/api/blog/${postId}`);
        const post = await response.json();
        
        // Create modal elements if they don't exist
        let modal = document.getElementById('blog-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'blog-modal';
            modal.className = 'blog-modal';
            modal.innerHTML = `
                <div class="blog-modal-content">
                    <span class="blog-modal-close">&times;</span>
                    <div class="blog-modal-header">
                        <h2 id="blog-modal-title"></h2>
                        <span id="blog-modal-date"></span>
                    </div>
                    <div class="blog-modal-image" id="blog-modal-image"></div>
                    <div class="blog-modal-content-text" id="blog-modal-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add close event
            const closeBtn = modal.querySelector('.blog-modal-close');
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
            
            // Close when clicking outside
            const closeModalOnOutsideClick = (event) => {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
            window.addEventListener('click', closeModalOnOutsideClick);
        }
        
        // Populate modal content
        document.getElementById('blog-modal-title').textContent = post.title;
        document.getElementById('blog-modal-date').textContent = new Date(post.created_at).toISOString().split('T')[0].replace(/-/g, '.');
        document.getElementById('blog-modal-content').textContent = post.content;
        
        const modalImage = document.getElementById('blog-modal-image');
        if (post.image) {
            modalImage.style.backgroundImage = `url('uploads/${post.image}')`;
            modalImage.style.display = 'block';
        } else {
            modalImage.style.display = 'none';
        }
        
        // Show modal
        modal.style.display = 'block';
    } catch (error) {
        console.error('Failed to load blog detail:', error);
        alert('加载博客详情失败，请重试。');
    }
}