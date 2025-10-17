import { Link } from "react-router-dom";

const Terms = () => {
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

      <h1>Terms of Service</h1>
      <span className="last-updated">Last updated: March 2025</span>

      <div className="section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Jetset, you accept and agree to be bound by the
          terms and provision of this agreement. These terms apply to all users
          of the Jetset mobile application and its services.
        </p>
      </div>

      <div className="section">
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of Jetset
          mobile application for personal, non-commercial transitory viewing
          only. This license does not include:
        </p>
        <ul>
          <li>Modifying or copying the materials</li>
          <li>Using the materials for commercial purposes</li>
          <li>Attempting to decompile or reverse engineer the software</li>
          <li>Removing any copyright or proprietary notations</li>
          <li>Transferring the materials to another person</li>
        </ul>
      </div>

      <div className="section">
        <h2>3. User Account</h2>
        <p>
          To use certain features of the app, you must register for an account.
          You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Enable two-factor authentication when available</li>
          <li>Notify us immediately of any security breaches</li>
        </ul>
      </div>

      <div className="section">
        <h2>4. AI-Generated Content</h2>
        <p>
          Jetset uses artificial intelligence to generate travel plans and
          recommendations. By using our service, you acknowledge that:
        </p>
        <ul>
          <li>AI-generated content is for informational purposes only</li>
          <li>
            We do not guarantee the accuracy of AI-generated recommendations
          </li>
          <li>You should verify all travel information independently</li>
          <li>
            We are not responsible for any issues arising from AI-generated
            content
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>5. User Content</h2>
        <p>
          Users retain all rights to the content they create and share through
          Jetset. By posting content, you grant Jetset a license to:
        </p>
        <ul>
          <li>Use, modify, and display that content</li>
          <li>Store and process the content for service delivery</li>
          <li>Use the content to improve our AI models</li>
          <li>Share the content with other users when appropriate</li>
        </ul>
      </div>

      <div className="section">
        <h2>6. Notifications</h2>
        <p>By using Jetset, you agree to receive notifications for:</p>
        <ul>
          <li>Trip updates and reminders</li>
          <li>Security alerts and account notifications</li>
          <li>App updates and maintenance</li>
          <li>Marketing communications (if opted in)</li>
        </ul>
        <p>You can manage your notification preferences in the app settings.</p>
      </div>

      <div className="section">
        <h2>7. Offline Usage</h2>
        <p>
          Jetset provides offline functionality for certain features. You agree
          that:
        </p>
        <ul>
          <li>Offline data may not reflect the most recent changes</li>
          <li>Some features require an internet connection</li>
          <li>We are not responsible for data loss during offline usage</li>
          <li>You should regularly sync your data when online</li>
        </ul>
      </div>

      <div className="section">
        <h2>8. Analytics and Monitoring</h2>
        <p>
          We collect usage data to improve our services. By using Jetset, you
          agree to:
        </p>
        <ul>
          <li>Allow collection of usage statistics</li>
          <li>Permit performance monitoring</li>
          <li>Accept error reporting and crash analytics</li>
          <li>Allow collection of engagement metrics</li>
        </ul>
      </div>

      <div className="section">
        <h2>9. Prohibited Uses</h2>
        <p>
          You may not use Jetset for any illegal or unauthorized purpose. You
          must not:
        </p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Transmit malicious code or viruses</li>
          <li>Attempt to access unauthorized areas</li>
          <li>Interfere with service operation</li>
          <li>Share false or misleading information</li>
        </ul>
      </div>

      <div className="section">
        <h2>10. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason including:
        </p>
        <ul>
          <li>Violation of these terms</li>
          <li>Suspicious or fraudulent activity</li>
          <li>Extended periods of inactivity</li>
          <li>At our sole discretion</li>
        </ul>
      </div>

      <div className="section">
        <h2>11. Limitation of Liability</h2>
        <p>Jetset shall not be liable for:</p>
        <ul>
          <li>
            Indirect, incidental, special, consequential or punitive damages
          </li>
          <li>Loss of profits, data, or use</li>
          <li>Service interruptions or errors</li>
          <li>Third-party actions or content</li>
          <li>AI-generated content accuracy</li>
          <li>Travel-related issues or incidents</li>
        </ul>
      </div>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>Email: terms@jetset.app</p>
        <p>Address: [Your Business Address]</p>
      </div>
    </div>
  );
};

export default Terms;
