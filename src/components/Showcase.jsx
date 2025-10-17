import OptimizedImage from "./OptimizedImage";

const Showcase = () => {
  const screenshots = [
    {
      image: "/src/assets/screenshots/generateTrip.webp",
      fallback: "/src/assets/screenshots/generateTrip.png",
      caption: "Create Your Scrapbook",
      description:
        "Start a new trip and add cover photos, dates, and destinations to organize your memories",
    },
    {
      image: "/src/assets/screenshots/reviewTrip.webp",
      fallback: "/src/assets/screenshots/reviewTrip.png",
      caption: "Document Your Journey",
      description:
        "Add excursions with photos and descriptions to capture every moment of your adventure",
    },
    {
      image: "/src/assets/screenshots/moreInfo.webp",
      fallback: "/src/assets/screenshots/moreInfo.png",
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
