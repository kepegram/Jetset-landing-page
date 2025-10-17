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
    <div className="container">
      <Link to="/" className="logo" onClick={scrollToTop}>
        Jetset
        <img
          src="/src/assets/adaptive-icon.png"
          alt="Jetset"
          className="logo-icon"
        />
      </Link>

      <h1>Privacy Policy</h1>
      <span className="last-updated">Last updated: March 2025</span>

      <h2>1. Information We Collect</h2>
      <p>We collect information that you provide directly to us, including:</p>
      <ul>
        <li>Name and contact information</li>
        <li>Account credentials</li>
        <li>Trip planning data and preferences</li>
        <li>Device information and location data</li>
        <li>Usage data and analytics</li>
        <li>Notification preferences and settings</li>
        <li>Travel style preferences and group size information</li>
        <li>Budget information and travel constraints</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Generate personalized travel plans using AI technology</li>
        <li>Improve our app and user experience</li>
        <li>Communicate with you through notifications</li>
        <li>Ensure security and prevent fraud</li>
        <li>Personalize your experience and recommendations</li>
        <li>Process transactions and payments</li>
        <li>Analyze app performance and user engagement</li>
        <li>Enable offline functionality</li>
      </ul>

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
        However, no method of transmission over the Internet is 100% secure. We
        strive to protect your personal information but cannot guarantee
        absolute security.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>Our app integrates with several third-party services:</p>
      <ul>
        <li>Firebase (Authentication, Database, Storage)</li>
        <li>Google Maps Platform (Maps, Places)</li>
        <li>Google Gemini API (AI-powered features)</li>
        <li>Zoho Mail (Email communications)</li>
      </ul>
      <p>
        Each service has its own privacy policy and data handling practices. We
        recommend reviewing their respective privacy policies for more
        information.
      </p>

      <h2>5. Analytics and Monitoring</h2>
      <p>We collect and analyze usage data to improve our services:</p>
      <ul>
        <li>App performance metrics</li>
        <li>User engagement patterns</li>
        <li>Feature usage statistics</li>
        <li>Error reporting and crash analytics</li>
      </ul>

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
