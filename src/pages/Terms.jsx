import { Link } from "react-router-dom";
import jetsetIcon from "../assets/icons/jetset-icon.svg";

const Terms = () => {
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
          <img src={jetsetIcon} alt="Jetset" className="logo-icon" />
          <span>Jetset</span>
        </Link>
      </div>

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
        <h2>4. Photo and Content Ownership</h2>
        <p>
          You retain full ownership of all photos and content you upload to
          Jetset. By using our service, you acknowledge that:
        </p>
        <ul>
          <li>You own all rights to the photos and content you upload</li>
          <li>
            You grant Jetset a license to store and display your content for
            service delivery
          </li>
          <li>
            You are responsible for ensuring you have rights to uploaded content
          </li>
          <li>
            We are not responsible for copyright infringement of user-uploaded
            content
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>5. User Content and Storage</h2>
        <p>
          Users retain all rights to the content they create and share through
          Jetset. By posting content, you grant Jetset a license to:
        </p>
        <ul>
          <li>Store and backup your photos and scrapbook entries</li>
          <li>Display content across your devices</li>
          <li>Process and optimize images for storage and display</li>
          <li>Synchronize content through cloud services</li>
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
          <li>Loss of photos, data, or scrapbook content</li>
          <li>Service interruptions or errors</li>
          <li>Third-party actions or content</li>
          <li>Photo quality or optimization results</li>
          <li>Data synchronization issues</li>
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
