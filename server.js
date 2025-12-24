const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
// const SQLiteStore = require('connect-sqlite3')(session);
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// 创建上传目录（仅在非生产环境）
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }
}

// 配置文件上传
let upload;

if (process.env.NODE_ENV === 'production') {
  // 在生产环境中禁用文件上传，因为Vercel文件系统是只读的
  upload = {
    single: () => (req, res, next) => {
      // 模拟文件上传，不实际保存文件
      req.file = null;
      next();
    }
  };
} else {
  // 在开发环境中使用真实的文件上传
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  
  upload = multer({ storage: storage });
}

const app = express();
const PORT = process.env.PORT || 3001;

// 配置中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 仅在开发环境中提供uploads目录的静态资源服务
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('uploads'));
}

// 配置会话 - 使用内存存储
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  // store: new SQLiteStore({ db: 'sessions.db', dir: './' }),
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24小时
}));

// 内存数据库模拟
const memoryDB = {
  users: [{
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    created_at: new Date().toISOString()
  }],
  blog_posts: [],
  gallery_images: [],
  messages: []
};

let nextIds = {
  blog_posts: 1,
  gallery_images: 1,
  messages: 1
};

// 用户认证中间件
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// API路由

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = memoryDB.users.find(u => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  req.session.user = user;
  res.json({ message: 'Login successful' });
});

// 用户注销
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// 检查登录状态
app.get('/api/check-login', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// 博客文章API

// 获取所有博客文章
app.get('/api/blog', (req, res) => {
  res.json(memoryDB.blog_posts);
});

// 获取单篇博客文章
app.get('/api/blog/:id', (req, res) => {
  const { id } = req.params;
  const post = memoryDB.blog_posts.find(p => p.id == id);
  
  if (!post) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  
  res.json(post);
});

// 创建博客文章
app.post('/api/blog', isAuthenticated, upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;
  
  const newPost = {
    id: nextIds.blog_posts++,
    title,
    content,
    image,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  memoryDB.blog_posts.push(newPost);
  res.json({ id: newPost.id, message: 'Blog post created successfully' });
});

// 更新博客文章
app.put('/api/blog/:id', isAuthenticated, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;
  
  const postIndex = memoryDB.blog_posts.findIndex(p => p.id == id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  
  const post = memoryDB.blog_posts[postIndex];
  post.title = title;
  post.content = content;
  if (image) {
    post.image = image;
  }
  post.updated_at = new Date().toISOString();
  
  res.json({ message: 'Blog post updated successfully' });
});

// 删除博客文章
app.delete('/api/blog/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  
  const postIndex = memoryDB.blog_posts.findIndex(p => p.id == id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Blog post not found' });
  }
  
  // 删除图片文件（仅在开发环境）
  const post = memoryDB.blog_posts[postIndex];
  if (post.image && process.env.NODE_ENV !== 'production') {
    const imagePath = path.join(__dirname, 'uploads', post.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  // 删除文章
  memoryDB.blog_posts.splice(postIndex, 1);
  res.json({ message: 'Blog post deleted successfully' });
});

// 相册API

// 获取所有相册图片
app.get('/api/gallery', (req, res) => {
  res.json(memoryDB.gallery_images);
});

// 上传相册图片
app.post('/api/gallery', isAuthenticated, upload.single('image'), (req, res) => {
  const { caption } = req.body;
  const filename = req.file ? req.file.filename : null;
  
  const newImage = {
    id: nextIds.gallery_images++,
    filename,
    caption,
    created_at: new Date().toISOString()
  };
  
  memoryDB.gallery_images.push(newImage);
  res.json({ id: newImage.id, message: 'Image uploaded successfully' });
});

// 删除相册图片
app.delete('/api/gallery/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  
  const imageIndex = memoryDB.gallery_images.findIndex(img => img.id == id);
  
  if (imageIndex === -1) {
    return res.status(404).json({ message: 'Image not found' });
  }
  
  // 删除图片文件（仅在开发环境）
  const image = memoryDB.gallery_images[imageIndex];
  if (process.env.NODE_ENV !== 'production') {
    const imagePath = path.join(__dirname, 'uploads', image.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  // 删除数据库记录
  memoryDB.gallery_images.splice(imageIndex, 1);
  res.json({ message: 'Image deleted successfully' });
});

// 留言API

// 获取所有留言
app.get('/api/messages', (req, res) => {
  res.json(memoryDB.messages);
});

// 创建留言
app.post('/api/messages', (req, res) => {
  const { name, email, content } = req.body;
  
  const newMessage = {
    id: nextIds.messages++,
    name,
    email,
    content,
    created_at: new Date().toISOString()
  };
  
  memoryDB.messages.push(newMessage);
  res.json({ id: newMessage.id, message: 'Message sent successfully' });
});

// 删除留言
app.delete('/api/messages/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  
  const messageIndex = memoryDB.messages.findIndex(msg => msg.id == id);
  
  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message not found' });
  }
  
  memoryDB.messages.splice(messageIndex, 1);
  res.json({ message: 'Message deleted successfully' });
});

// 为admin目录创建静态文件服务
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// 为管理后台其他页面添加认证中间件（除了登录页面）
app.use('/admin/dashboard.html', isAuthenticated, (req, res, next) => next());

// 导出应用供Vercel使用
module.exports = app;

// 仅在本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
  });
}
