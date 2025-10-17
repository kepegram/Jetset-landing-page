import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Showcase from "../components/Showcase";
import DownloadSection from "../components/DownloadSection";
import Footer from "../components/Footer";

const Home = () => {
  useEffect(() => {
    // Image loading optimization
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.addEventListener("load", () => {
            img.classList.add("loaded");
          });
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    // Performance monitoring
    if (window.performance) {
      const timing = window.performance.timing;
      window.addEventListener("load", () => {
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
      });
    }

    // Service Worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);

  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <Showcase />
      <DownloadSection />
      <Footer />
    </>
  );
};

export default Home;
