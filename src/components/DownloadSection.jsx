import appStore from "../assets/app-store.png";

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
              src={appStore}
              alt="Download on the App Store"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
