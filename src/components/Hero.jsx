import appStore from "../assets/app-store.png";

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
                src={appStore}
                alt="Download on the App Store"
              />
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="tape-decoration tape-1"></div>
          <div className="tape-decoration tape-2"></div>
          <div className="device-wrapper welcome-screen">
            <div className="device-screen image-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📸</span>
                <span className="placeholder-text">App Screenshot</span>
              </div>
            </div>
          </div>
          <div className="device-wrapper main-screen">
            <div className="device-screen image-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📸</span>
                <span className="placeholder-text">App Screenshot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-gradient"></div>
    </section>
  );
};

export default Hero;
