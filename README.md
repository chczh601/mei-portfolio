# Mei's Personal Website

A highly personalized personal portfolio website with a natural, refreshing design style.

## Project Overview

This is a高端视觉博客/探索型个人主页 (high-end visual blog/exploratory personal homepage) built with pure HTML, CSS, and JavaScript. It showcases personal information, professional background, skills, journey, and blog content in a visually appealing and interactive way.

## Design Philosophy

- **Color Scheme**: Light turquoise (#B6DDDC) as the core color, paired with white, light gray, dark gray, and墨绿色 (dark green) for a natural, refreshing, and sophisticated look.
- **Visual Style**: Natural, exploratory, with ample white space for a "breathing" effect.
- **Layout**: Immersive hero section with large background, card-based content modules, and non-traditional web layout for a unique personal touch.

## Features

### Sections
- **Hero**: Immersive full-screen section with animated background and personal introduction
- **About**: Personal information and background story
- **Skills**: Card-based skill showcase (SQL, SPSS, Office Suite, etc.)
- **Journey**: Timeline of educational and personal growth
- **Blog**: Interactive blog card slider with mock content
- **Footer**: Contact information and social links

### Interactions & Animations
- Smooth scroll animations using Intersection Observer
- Card hover effects (transform, shadow, blur)
- Hero section background gradient animation
- Navbar scroll transparency change
- Touch support for mobile blog slider
- Subtle text animations

## Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid, Flexbox, and CSS animations
- **JavaScript (ES6+)**: Interactive features and animations
- **Responsive Design**: Mobile-first approach with media queries

## File Structure

```
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All CSS styles
├── js/
│   ├── animations.js       # Scroll animations and Intersection Observer
│   └── main.js             # Other interactive features
└── README.md               # This file
```

## Local Development

### Method 1: Direct Opening
1. Download or clone this repository
2. Open the `index.html` file directly in your web browser

### Method 2: Local Server (Recommended)
For better performance and to avoid CORS issues:

#### Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser

#### Using Node.js (with http-server):
```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8000
```
Then open `http://localhost:8000` in your browser

## Deployment

### GitHub Pages
1. Create a new repository on GitHub
2. Push the project files to the repository
3. Go to repository settings > Pages
4. Set the source to `main` branch and `/ (root)` directory
5. Click "Save" and wait for deployment
6. Your website will be available at `https://yourusername.github.io/repositoryname/`

### Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" and import your GitHub repository
3. Follow the prompts to configure your project
4. Deploy with Vercel's default settings
5. Your website will be available at the generated Vercel URL

### Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings (no build command needed for static HTML/CSS/JS)
5. Click "Deploy site"
6. Your website will be available at the generated Netlify URL

## Customization

### Adding Content
- **Hero Section**: Edit `index.html` in the `hero` section
- **About Me**: Update content in the `about-text` div
- **Skills**: Add/remove skill cards in the `skills-grid` section
- **Journey**: Modify timeline items in the `timeline` section
- **Blog Posts**: Add new blog cards in the `blog-slider` section

### Changing Colors
- Main color: Update `#B6DDDC` in `style.css`
- Other colors: Modify the color values in the CSS variables or directly in the styles

### Adding Images
- Replace placeholder images with your own
- Ensure proper image optimization for web performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Optimize images before uploading
- Minify CSS and JavaScript files for production
- Use a CDN for faster asset delivery
- Enable compression on your server

## Future Enhancements

- Add a contact form
- Integrate a CMS for blog management
- Add dark mode support
- Implement lazy loading for images
- Add more interactive elements

## License

MIT License

## Credits

Designed and developed by Mei

---

Enjoy exploring and customizing your personal website!