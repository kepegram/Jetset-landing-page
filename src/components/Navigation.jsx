import { Link } from "react-router-dom";

const Navigation = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="logo" onClick={scrollToTop}>
          Jetset
          <img
            src="/src/assets/adaptive-icon.png"
            alt="Jetset"
            className="logo-icon"
          />
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#ai">AI Technology</a>
          <a href="#download">Download</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
