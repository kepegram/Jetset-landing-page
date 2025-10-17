const Features = () => {
  const features = [
    {
      icon: "🎯",
      title: "Smart Planning",
      description:
        "Generate personalized travel plans instantly using advanced AI that understands your preferences and travel style.",
    },
    {
      icon: "🗺️",
      title: "Dynamic Itineraries",
      description:
        "Customize your trip duration, activities, and budget with our intelligent recommendation system.",
    },
    {
      icon: "✨",
      title: "AI Powered",
      description:
        "Leverage Google's Gemini API for context-aware suggestions and real-time adaptability.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Enterprise-grade security with encrypted data storage and protected communications.",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>Reimagine Travel Planning</h2>
          <p>
            Discover how Jetset transforms your travel experience with
            cutting-edge AI technology and intuitive design.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
