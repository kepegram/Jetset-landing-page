import OptimizedImage from "./OptimizedImage";

const Showcase = () => {
  const screenshots = [
    {
      image: "/src/assets/screenshots/generateTrip.webp",
      fallback: "/src/assets/screenshots/generateTrip.png",
      caption: "AI Trip Generation",
      description:
        "Create personalized itineraries instantly with our advanced AI technology",
    },
    {
      image: "/src/assets/screenshots/reviewTrip.webp",
      fallback: "/src/assets/screenshots/reviewTrip.png",
      caption: "Smart Planning",
      description:
        "Review and customize your AI-generated travel plans effortlessly",
    },
    {
      image: "/src/assets/screenshots/moreInfo.webp",
      fallback: "/src/assets/screenshots/moreInfo.png",
      caption: "Personalization",
      description:
        "Fine-tune your preferences for perfectly tailored travel experiences",
    },
  ];

  return (
    <section id="showcase" className="showcase">
      <div className="container">
        <div className="section-header">
          <h2>Experience Jetset</h2>
          <p className="showcase-description">
            See how Jetset transforms your travel planning with AI-powered
            features and an intuitive interface designed for seamless
            experiences.
          </p>
        </div>
        <div className="device-showcase">
          {screenshots.map((screenshot, index) => (
            <div key={index} className="device-container">
              <div className="device-wrapper">
                <div className="device-screen">
                  <OptimizedImage
                    src={screenshot.fallback}
                    srcSet={screenshot.image}
                    alt={screenshot.caption}
                    width="270"
                    height="584"
                    loading="lazy"
                  />
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
