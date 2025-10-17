const DownloadSection = () => {
  return (
    <section id="download" className="download-section">
      <div className="container">
        <h2>Start Preserving Your Memories</h2>
        <p>
          Download Jetset today and turn your travels into beautiful digital
          scrapbooks.
        </p>
        <div className="download-buttons">
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
    </section>
  );
};

export default DownloadSection;
