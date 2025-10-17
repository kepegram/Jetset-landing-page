const TechnologySection = () => {
  const techFeatures = [
    {
      icon: "☁️",
      title: "Cloud Synchronization",
      description:
        "Your scrapbooks are safely stored and synced across all your devices in real-time",
    },
    {
      icon: "📱",
      title: "Cross-Platform Experience",
      description:
        "Native iOS and Android apps with smooth animations and intuitive touch interactions",
    },
  ];

  return (
    <section id="ai" className="ai-section">
      <div className="container">
        <div className="ai-content">
          <div
            className="section-header"
            style={{ textAlign: "left", margin: 0 }}
          >
            <h2>Built with Modern Technology</h2>
            <p>
              Experience a seamless scrapbooking experience powered by React
              Native, Firebase, and cutting-edge mobile technologies.
            </p>
          </div>
          <div className="ai-features">
            {techFeatures.map((feature, index) => (
              <div key={index} className="ai-feature-item">
                <span className="ai-feature-icon">{feature.icon}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ai-visual">
          <div className="code-window">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="code-content">
              <pre>
                <code>
                  <span className="process">Uploading photos...</span>
                  <span className="process">Creating scrapbook entry...</span>
                  <span className="process">Syncing to cloud storage...</span>
                  <span className="success">
                    ✨ Your memories are preserved!
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
