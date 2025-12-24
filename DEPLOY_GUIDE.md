# Vercel 部署指南

## 项目状态

✅ 已完成的准备工作：
- 网站前端和后端代码已整合完成
- 静态资源已复制到 `public` 目录
- `server.js` 已适配 Vercel 环境
- `vercel.json` 配置文件已创建
- 所有依赖项已在 `package.json` 中定义

## 部署方式一：通过 Vercel 官网部署（推荐）

### 步骤 1：创建 GitHub 仓库
1. 登录 GitHub
2. 创建一个新的仓库
3. 将本地代码推送到 GitHub 仓库
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

### 步骤 2：部署到 Vercel
1. 登录 [Vercel 官网](https://vercel.com)
2. 点击右上角的 "New Project" 按钮
3. 选择 "Import Git Repository"
4. 连接你的 GitHub 账户
5. 选择刚刚创建的仓库
6. 配置部署选项：
   - Framework Preset: **Node.js**
   - Build Command: 留空（Vercel 会自动检测）
   - Output Directory: 留空
7. 点击 "Deploy" 按钮

### 步骤 3：获取公开访问链接
部署成功后，Vercel 会显示一个成功页面，并提供一个公开访问链接，格式类似于：
`https://your-project-name.vercel.app`

## 部署方式二：使用 Vercel CLI（可选）

### 步骤 1：安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel
```bash
vercel login
```

### 步骤 3：部署项目
在项目根目录下执行：
```bash
vercel
```

### 步骤 4：确认部署配置
根据提示确认部署配置：
- Set up and deploy: **y**
- Which scope do you want to deploy to: 选择你的账户
- Link to existing project: **n**
- What's your project's name: 输入项目名称
- In which directory is your code located: **.**

### 步骤 5：访问部署后的网站
部署成功后，Vercel 会提供一个预览链接。

## 项目功能说明

### 前端功能
- 博客展示（含图片和详情模态框）
- 相册展示
- 留言功能
- 响应式设计

### 后端功能
- 博客文章管理
- 相册图片上传
- 留言管理
- 用户认证（管理员登录）

### 管理员账户
- 用户名：admin
- 密码：admin123

## 注意事项

1. **数据存储**：当前使用内存数据库，重启服务器后数据会丢失
2. **文件上传**：上传的图片会存储在服务器临时目录
3. **安全性**：生产环境建议：
   - 更改默认管理员密码
   - 使用 HTTPS
   - 配置适当的 CORS 策略

## 后续优化建议

1. 添加持久化数据库（如 MongoDB 或 PostgreSQL）
2. 实现用户注册功能
3. 添加图片优化和压缩
4. 实现 SEO 优化
5. 添加网站分析工具

## 联系方式

如有部署问题，可联系：
- Vercel 官方文档：https://vercel.com/docs
- 或在项目的 GitHub Issues 中提问
