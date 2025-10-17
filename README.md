# Jetset Landing Page

A modern, responsive landing page for Jetset - an AI-powered travel planning app. Built with React, Vite, and modern web technologies, this landing page showcases the app's key features and provides a seamless user experience.

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with a focus on user experience
- **Responsive Layout**: Fully responsive design that works on all devices
- **Light Theme**: Professional white theme with blue accents (#3BACE3)
- **Interactive Elements**: Subtle animations and hover effects
- **Component-Based Architecture**: Reusable React components
- **Optimized Images**: Lazy loading and WebP format support
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Vite PWA Plugin**: Progressive Web App support
- **CSS**: Custom properties for theming
- **Modern JavaScript**: ES6+ features

## 📱 Key Sections

1. **Hero Section**

   - Main value proposition
   - App store download buttons
   - Featured app screenshots with optimized loading

2. **Features Grid**

   - Smart Planning
   - Dynamic Itineraries
   - AI Technology
   - Security Features

3. **App Showcase**

   - Interactive app screenshots
   - Feature descriptions
   - User interface highlights

4. **AI Technology**

   - Technical capabilities
   - Gemini API integration
   - Interactive code window

5. **Download Section**
   - App store links
   - Call to action

## 📄 Additional Pages

- **Privacy Policy**: Detailed privacy information (React component)
- **Terms of Service**: User agreement and terms (React component)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will run on `http://localhost:3000` by default.

## 📦 Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # React components
│   ├── Navigation.jsx
│   ├── Hero.jsx
│   ├── Features.jsx
│   ├── Showcase.jsx
│   ├── AISection.jsx
│   ├── DownloadSection.jsx
│   ├── Footer.jsx
│   └── OptimizedImage.jsx
├── pages/          # Page components
│   ├── Home.jsx
│   ├── Privacy.jsx
│   └── Terms.jsx
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── styles.css      # Global styles
```

## ⚡ Performance Features

- **Code Splitting**: Lazy loading for Privacy and Terms pages
- **Image Optimization**: WebP format with lazy loading
- **PWA Support**: Service worker for offline functionality
- **Optimized Build**: Vite's efficient bundling
- **Preloading**: Critical assets preloaded for faster initial load

## 🚀 Deployment

The landing page can be deployed to:

- GitHub Pages
- Vercel
- Netlify
- Any static hosting service

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🔄 Updates

Last updated: October 2025 - Migrated to React
