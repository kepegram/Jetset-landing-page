import { useState, useEffect } from "react";

const OptimizedImage = ({
  src,
  srcSet,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  fetchPriority = "auto",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (loading === "eager") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const imgRef = document.querySelector(`img[alt="${alt}"]`);
    if (imgRef) {
      observer.observe(imgRef);
    }

    return () => observer.disconnect();
  }, [alt, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <picture>
      {srcSet && <source srcSet={srcSet} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? "loaded" : ""}`}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={handleLoad}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
