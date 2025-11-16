const Showcase = () => {
  const screenshots = [
    {
      caption: "Create Your Scrapbook",
      description:
        "Start a new trip and add cover photos, dates, and destinations to organize your memories",
    },
    {
      caption: "Document Your Journey",
      description:
        "Add excursions with photos and descriptions to capture every moment of your adventure",
    },
    {
      caption: "Relive Your Memories",
      description:
        "Browse through beautiful photo galleries and revisit your favorite travel moments anytime",
    },
  ];

  return (
    <section id="showcase" className="showcase">
      <div className="container">
        <div className="section-header">
          <h2>Experience Jetset</h2>
          <p className="showcase-description">
            See how Jetset helps you create beautiful digital scrapbooks with an
            intuitive interface designed for capturing and preserving your
            travel memories.
          </p>
        </div>
        <div className="device-showcase">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="device-container">
              <div className="device-wrapper">
                <div className="device-screen image-placeholder">
                  <div className="placeholder-content">
                    <span className="placeholder-icon">📱</span>
                    <span className="placeholder-text">App Screenshot</span>
                  </div>
                </div>
              </div>
              <p className="screen-caption">{screenshot.caption}</p>
              <p className="screen-description">{screenshot.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
