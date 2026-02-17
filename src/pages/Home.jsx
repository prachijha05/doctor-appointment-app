import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to HealthCare</h1>
        <p>Book appointments with the best doctors in your area</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/doctors" className="btn btn-outline">
            Find Doctors
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </div>

      <h2 className="text-center mb-2">Why Choose Us?</h2>
      <div className="features-grid">
        <div className="card">
          <div className="feature-icon">🔍</div>
          <h3 className="feature-title">Easy Search</h3>
          <p className="feature-description">
            Find the right doctor by specialty, location, and availability
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">📅</div>
          <h3 className="feature-title">Quick Booking</h3>
          <p className="feature-description">
            Book appointments in just a few clicks with instant confirmation
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">⭐</div>
          <h3 className="feature-title">Verified Doctors</h3>
          <p className="feature-description">
            All our doctors are certified professionals with verified
            credentials
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">💬</div>
          <h3 className="feature-title">Patient Reviews</h3>
          <p className="feature-description">
            Read genuine reviews from patients to make informed decisions
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">🔔</div>
          <h3 className="feature-title">Reminders</h3>
          <p className="feature-description">
            Get notifications and reminders for your upcoming appointments
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">🏥</div>
          <h3 className="feature-title">Multiple Specialties</h3>
          <p className="feature-description">
            Access to specialists across various medical fields
          </p>
        </div>
      </div>

      <div
        className="card mt-2"
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <h2>Ready to Get Started?</h2>
        <p style={{ color: "var(--text-light)", margin: "1rem 0 2rem" }}>
          Join thousands of satisfied patients who trust us with their
          healthcare needs
        </p>
        <Link to="/doctors" className="btn btn-primary">
          Book Your Appointment Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
