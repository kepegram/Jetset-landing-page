import OptimizedImage from "./OptimizedImage";

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>
            Your Travels
            <br />
            <span>Beautifully Preserved</span>
          </h1>
          <p className="hero-subtitle">
            Transform your adventures into stunning digital scrapbooks. Capture
            every moment, organize your memories, and relive your journeys
            forever.
          </p>
          <div className="hero-buttons">
            <a href="#" className="store-badge app-store">
              <img
                src="/src/assets/app-store.png"
                alt="Download on the App Store"
              />
            </a>
            <div className="store-badge google-play">
              <img
                src="/src/assets/google-play.png"
                alt="Get it on Google Play"
              />
              <div className="coming-soon-overlay">
                <span>Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="device-wrapper welcome-screen">
            <OptimizedImage
              src="/src/assets/screenshots/welcome.png"
              srcSet="/src/assets/screenshots/welcome.webp"
              alt="Jetset Welcome Screen"
              width="270"
              height="584"
              className="device-screen"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="device-wrapper main-screen">
            <OptimizedImage
              src="/src/assets/screenshots/home-screen.png"
              srcSet="/src/assets/screenshots/home-screen.webp"
              alt="Jetset App Interface"
              width="270"
              height="584"
              className="device-screen"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
      <div className="hero-gradient"></div>
    </section>
  );
};

export default Hero;
