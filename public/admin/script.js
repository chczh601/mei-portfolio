// 全局变量
let currentBlogId = null;
// API基础URL
const API_BASE_URL = window.location.origin;

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面
    if (window.location.pathname.includes('login.html')) {
        initializeLoginPage();
    } else {
        initializeDashboard();
    }
});

// 初始化登录页面
function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 发送登录请求
        fetch(API_BASE_URL + '/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Login successful') {
                window.location.href = 'dashboard.html';
            } else {
                showMessage(loginMessage, data.message, 'error');
            }
        })
        .catch(error => {
            showMessage(loginMessage, '登录失败，请检查网络连接', 'error');
            console.error('Login error:', error);
        });
    });
}

// 初始化管理后台
function initializeDashboard() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化导航
    initializeNavigation();
    
    // 初始化博客管理
    initializeBlogManagement();
    
    // 初始化相册管理
    initializeGalleryManagement();
    
    // 初始化留言管理
    initializeMessagesManagement();
    
    // 初始化退出登录
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// 检查登录状态
function checkLoginStatus() {
    fetch(API_BASE_URL + '/api/check-login')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.href = 'login.html';
            } else {
                document.getElementById('username-display').textContent = data.user.username;
            }
        })
        .catch(error => {
            console.error('Check login status error:', error);
            window.location.href = 'login.html';
        });
}

// 退出登录
function logout() {
    fetch(API_BASE_URL + '/api/logout')
        .then(response => response.json())
        .then(data => {
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
}

// 初始化导航
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// 初始化博客管理
function initializeBlogManagement() {
    const addBlogBtn = document.getElementById('add-blog-btn');
    const blogFormContainer = document.getElementById('blog-form-container');
    const blogForm = document.getElementById('blog-form');
    const cancelBlogBtn = document.getElementById('cancel-blog-btn');
    
    // 加载博客列表
    loadBlogs();
    
    // 添加博客按钮点击事件
    addBlogBtn.addEventListener('click', function() {
        currentBlogId = null;
        clearBlogForm();
        blogFormContainer.classList.remove('hidden');
    });
    
    // 取消按钮点击事件
    cancelBlogBtn.addEventListener('click', function() {
        blogFormContainer.classList.add('hidden');
        clearBlogForm();
    });
    
    // 博客表单提交事件
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('blog-title').value);
        formData.append('content', document.getElementById('blog-content').value);
        
        const imageFile = document.getElementById('blog-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        if (currentBlogId) {
            updateBlog(currentBlogId, formData);
        } else {
            createBlog(formData);
        }
    });
}

// 加载博客列表
function loadBlogs() {
    fetch(API_BASE_URL + '/api/blog')
        .then(response => response.json())
        .then(blogs => {
            const blogList = document.getElementById('blog-list');
            blogList.innerHTML = '';
            
            if (blogs.length === 0) {
                blogList.innerHTML = '<p>暂无博客文章</p>';
                return;
            }
            
            blogs.forEach(blog => {
                const blogItem = document.createElement('div');
                blogItem.className = 'blog-item';
                
                // 生成预览内容（最多150个字符）
                const previewContent = blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content;
                
                blogItem.innerHTML = `
                    <h4>${blog.title}</h4>
                    <div class="blog-meta">创建时间: ${new Date(blog.created_at).toLocaleString()}</div>
                    <div class="blog-excerpt">${previewContent.replace(/<[^>]+>/g, '')}</div>
                    <div class="blog-item-actions">
                        <button class="edit-btn" onclick="editBlog(${blog.id})">编辑</button>
                        <button class="delete-btn" onclick="deleteBlog(${blog.id})">删除</button>
                    </div>
                `;
                
                blogList.appendChild(blogItem);
            });
        })
        .catch(error => {
            console.error('Load blogs error:', error);
        });
}

// 清空博客表单
function clearBlogForm() {
    document.getElementById('blog-id').value = '';
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('blog-image').value = '';
}

// 创建博客
function createBlog(formData) {
    fetch(API_BASE_URL + '/api/blog', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes('successfully')) {
            document.getElementById('blog-form-container').classList.add('hidden');
            clearBlogForm();
            loadBlogs();
        }
    })
    .catch(error => {
        console.error('Create blog error:', error);
    });
}

// 编辑博客
function editBlog(id) {
    fetch(API_BASE_URL + `/api/blog/${id}`)
        .then(response => response.json())
        .then(blog => {
            document.getElementById('blog-id').value = blog.id;
            document.getElementById('blog-title').value = blog.title;
            document.getElementById('blog-content').value = blog.content;
            currentBlogId = id;
            document.getElementById('blog-form-container').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Edit blog error:', error);
        });
}

// 更新博客
function updateBlog(id, formData) {
    fetch(API_BASE_URL + `/api/blog/${id}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes('successfully')) {
            document.getElementById('blog-form-container').classList.add('hidden');
            clearBlogForm();
            loadBlogs();
        }
    })
    .catch(error => {
        console.error('Update blog error:', error);
    });
}

// 删除博客
function deleteBlog(id) {
    if (confirm('确定要删除这篇博客吗？')) {
        fetch(API_BASE_URL + `/api/blog/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message.includes('successfully')) {
                loadBlogs();
            }
        })
        .catch(error => {
            console.error('Delete blog error:', error);
        });
    }
}

// 初始化相册管理
function initializeGalleryManagement() {
    const addGalleryBtn = document.getElementById('add-gallery-btn');
    const galleryFormContainer = document.getElementById('gallery-form-container');
    const galleryForm = document.getElementById('gallery-form');
    const cancelGalleryBtn = document.getElementById('cancel-gallery-btn');
    
    // 加载相册
    loadGallery();
    
    // 添加图片按钮点击事件
    addGalleryBtn.addEventListener('click', function() {
        clearGalleryForm();
        galleryFormContainer.classList.remove('hidden');
    });
    
    // 取消按钮点击事件
    cancelGalleryBtn.addEventListener('click', function() {
        galleryFormContainer.classList.add('hidden');
        clearGalleryForm();
    });
    
    // 相册表单提交事件
    galleryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('caption', document.getElementById('gallery-caption').value);
        formData.append('image', document.getElementById('gallery-image').files[0]);
        
        uploadGalleryImage(formData);
    });
}

// 加载相册
function loadGallery() {
    fetch(API_BASE_URL + '/api/gallery')
        .then(response => response.json())
        .then(images => {
            const galleryList = document.getElementById('gallery-list');
            galleryList.innerHTML = '';
            
            if (images.length === 0) {
                galleryList.innerHTML = '<p>暂无相册图片</p>';
                return;
            }
            
            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                galleryItem.innerHTML = `
                    <img src="/uploads/${image.filename}" alt="${image.caption || '相册图片'}">
                    <div class="gallery-caption">${image.caption || '无描述'}</div>
                    <div class="gallery-item-actions">
                        <button class="delete-btn" onclick="deleteGalleryImage(${image.id})">删除</button>
                    </div>
                `;
                
                galleryList.appendChild(galleryItem);
            });
        })
        .catch(error => {
            console.error('Load gallery error:', error);
        });
}

// 清空相册表单
function clearGalleryForm() {
    document.getElementById('gallery-caption').value = '';
    document.getElementById('gallery-image').value = '';
}

// 上传相册图片
function uploadGalleryImage(formData) {
    fetch(API_BASE_URL + '/api/gallery', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.includes('successfully')) {
            document.getElementById('gallery-form-container').classList.add('hidden');
            clearGalleryForm();
            loadGallery();
        }
    })
    .catch(error => {
        console.error('Upload gallery image error:', error);
    });
}

// 删除相册图片
function deleteGalleryImage(id) {
    if (confirm('确定要删除这张图片吗？')) {
        fetch(API_BASE_URL + `/api/gallery/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message.includes('successfully')) {
                loadGallery();
            }
        })
        .catch(error => {
            console.error('Delete gallery image error:', error);
        });
    }
}

// 初始化留言管理
function initializeMessagesManagement() {
    loadMessages();
}

// 加载留言
function loadMessages() {
    fetch(API_BASE_URL + '/api/messages')
        .then(response => response.json())
        .then(messages => {
            const messagesList = document.getElementById('messages-list');
            messagesList.innerHTML = '';
            
            if (messages.length === 0) {
                messagesList.innerHTML = '<p>暂无留言</p>';
                return;
            }
            
            messages.forEach(message => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                
                messageItem.innerHTML = `
                    <div class="message-header">
                        <div>
                            <div class="message-name">${message.name}</div>
                            <div class="message-email">${message.email}</div>
                        </div>
                    </div>
                    <div class="message-meta">${new Date(message.created_at).toLocaleString()}</div>
                    <div class="message-content">${message.content}</div>
                    <div class="blog-item-actions">
                        <button class="delete-btn" onclick="deleteMessage(${message.id})">删除</button>
                    </div>
                `;
                
                messagesList.appendChild(messageItem);
            });
        })
        .catch(error => {
            console.error('Load messages error:', error);
        });
}

// 删除留言
function deleteMessage(id) {
    if (confirm('确定要删除这条留言吗？')) {
        fetch(API_BASE_URL + `/api/messages/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message.includes('successfully')) {
                loadMessages();
            }
        })
        .catch(error => {
            console.error('Delete message error:', error);
        });
    }
}

// 退出登录
function logout() {
    fetch(API_BASE_URL + '/api/logout')
        .then(response => response.json())
        .then(data => {
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
}

// 显示消息
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
    
    // 3秒后隐藏消息
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}