const AISection = () => {
  const aiFeatures = [
    {
      icon: "🤖",
      title: "Natural Language Processing",
      description: "Understand your preferences through natural conversation",
    },
    {
      icon: "⚡",
      title: "Real-time Optimization",
      description:
        "Continuously improve recommendations based on your feedback",
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
            <h2>Powered by Advanced AI</h2>
            <p>
              Experience the power of Google's Gemini API, creating travel
              experiences that adapt to your unique preferences.
            </p>
          </div>
          <div className="ai-features">
            {aiFeatures.map((feature, index) => (
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
                  <span className="process">Analyzing preferences...</span>
                  <span className="process">Generating optimal routes...</span>
                  <span className="process">
                    Creating personalized itinerary...
                  </span>
                  <span className="success">
                    ✨ Your perfect trip is ready!
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

export default AISection;
