# Jetset Landing Page

A modern, responsive landing page for Jetset - a digital travel scrapbook app. Built with React, Vite, and modern web technologies, this landing page showcases the app's key features and provides a seamless user experience.

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

## 📱 About Jetset

Jetset is a modern travel scrapbook app that helps travelers capture, organize, and preserve their travel memories. Key features include:

- **Digital Scrapbooks**: Create beautiful trip scrapbooks with photos and descriptions
- **Smart Organization**: Organize trips by dates and destinations with multiple excursions
- **Photo Galleries**: Full-screen photo viewing with swipe navigation
- **Cloud Sync**: Real-time synchronization across all devices
- **Cross-Platform**: Native iOS and Android apps built with React Native
- **Secure Storage**: Enterprise-grade security with Firebase

## 📱 Key Sections

1. **Hero Section**

   - Main value proposition
   - App store download buttons
   - Featured app screenshots with optimized loading

2. **Features Grid**

   - Digital Scrapbooks
   - Smart Organization
   - Photo Galleries
   - Security Features

3. **App Showcase**

   - Interactive app screenshots
   - Feature descriptions
   - User interface highlights

4. **Technology Section**

   - Technical capabilities
   - Firebase and React Native integration
   - Cloud synchronization

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
│   ├── AISection.jsx (TechnologySection)
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

The landing page automatically deploys to GitHub Pages when you push to the `main` branch.

### GitHub Actions Setup

1. Ensure GitHub Pages is enabled in repository settings
2. Set Source to "GitHub Actions"
3. Push to `main` branch to trigger deployment

### Manual Build

```bash
npm run build
```

The production files will be in the `dist/` directory.

## 🌐 Custom Domain

This landing page is configured for the custom domain: `download-jetset.app`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🔄 Updates

Last updated: October 2025 - Complete redesign for digital scrapbook app
