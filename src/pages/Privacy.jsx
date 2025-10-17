import { Link } from "react-router-dom";

const Privacy = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <Link to="/" className="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          style={{ width: "20px", height: "20px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back to Home
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          marginTop: "2rem",
        }}
      >
        <Link to="/" className="logo" onClick={scrollToTop}>
          Jetset
          <img
            src="/src/assets/adaptive-icon.png"
            alt="Jetset"
            className="logo-icon"
          />
        </Link>
      </div>

      <h1>Privacy Policy</h1>
      <span className="last-updated">Last updated: March 2025</span>

      <div className="section">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul>
          <li>Name and contact information</li>
          <li>Account credentials</li>
          <li>Travel scrapbook data and photos</li>
          <li>Trip descriptions and excursion entries</li>
          <li>Device information and location data</li>
          <li>Usage data and analytics</li>
          <li>Notification preferences and settings</li>
          <li>Photo uploads and media files</li>
        </ul>
      </div>

      <div className="section">
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our services</li>
          <li>Store and organize your travel scrapbooks and photos</li>
          <li>Synchronize your data across devices</li>
          <li>Improve our app and user experience</li>
          <li>Communicate with you through notifications</li>
          <li>Ensure security and prevent fraud</li>
          <li>Process and optimize photo uploads</li>
          <li>Analyze app performance and user engagement</li>
          <li>Enable offline functionality</li>
        </ul>
      </div>

      <div className="section">
        <h2>3. Data Storage and Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information, including:
        </p>
        <ul>
          <li>Encrypted data storage and transmission</li>
          <li>Secure authentication with two-factor verification</li>
          <li>Regular security audits and updates</li>
          <li>Offline data persistence with secure local storage</li>
          <li>Protected API communications</li>
        </ul>
        <p>
          However, no method of transmission over the Internet is 100% secure.
          We strive to protect your personal information but cannot guarantee
          absolute security.
        </p>
      </div>

      <div className="section">
        <h2>4. Third-Party Services</h2>
        <p>Our app integrates with several third-party services:</p>
        <ul>
          <li>Firebase (Authentication, Firestore Database, Cloud Storage)</li>
          <li>Expo Services (Image handling and optimization)</li>
          <li>React Native (Cross-platform mobile framework)</li>
          <li>Cloud storage providers for photo backups</li>
        </ul>
        <p>
          Each service has its own privacy policy and data handling practices.
          We recommend reviewing their respective privacy policies for more
          information.
        </p>
      </div>

      <div className="section">
        <h2>5. Analytics and Monitoring</h2>
        <p>We collect and analyze usage data to improve our services:</p>
        <ul>
          <li>App performance metrics</li>
          <li>User engagement patterns</li>
          <li>Feature usage statistics</li>
          <li>Error reporting and crash analytics</li>
        </ul>
      </div>

      <div className="section">
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent</li>
          <li>Opt-out of analytics collection</li>
          <li>Manage notification preferences</li>
          <li>Export your data</li>
        </ul>
      </div>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p>Email: privacy@jetset.app</p>
        <p>Address: [Your Business Address]</p>
      </div>
    </div>
  );
};

export default Privacy;
