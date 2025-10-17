const Features = () => {
  const features = [
    {
      icon: "📸",
      title: "Digital Scrapbooks",
      description:
        "Create beautiful trip scrapbooks with photos, descriptions, and organized excursions. Preserve your travel memories in a structured, visual format.",
    },
    {
      icon: "🗂️",
      title: "Smart Organization",
      description:
        "Organize trips by dates and destinations. Add multiple excursions with photos and descriptions. Search and filter through all your memories.",
    },
    {
      icon: "🖼️",
      title: "Photo Galleries",
      description:
        "Upload multiple photos per entry with full-screen viewing. Swipe through your memories with smooth animations and intuitive navigation.",
    },
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>Preserve Your Travel Memories</h2>
          <p>
            Discover how Jetset transforms your travel experiences into
            beautiful digital scrapbooks with intuitive organization and
            stunning photo galleries.
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
