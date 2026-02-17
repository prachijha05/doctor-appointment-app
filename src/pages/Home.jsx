import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import "./Home.css";

const stats = [
  { number: "500+", label: "Expert Doctors" },
  { number: "50K+", label: "Happy Patients" },
  { number: "20+", label: "Specialties" },
  { number: "4.9★", label: "Avg Rating" },
];

const specialties = [
  { icon: "❤️", name: "Cardiology", desc: "Heart & vascular care" },
  { icon: "🧠", name: "Neurology", desc: "Brain & nerve disorders" },
  { icon: "🦴", name: "Orthopedics", desc: "Bone & joint treatment" },
  { icon: "👶", name: "Pediatrics", desc: "Children's healthcare" },
  { icon: "🔬", name: "Dermatology", desc: "Skin, hair & nail care" },
  { icon: "🧬", name: "Psychiatry", desc: "Mental health support" },
];

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Find Your Doctor",
    desc: "Search by specialty, name, or availability from our verified network.",
  },
  {
    num: "02",
    icon: "📅",
    title: "Book a Slot",
    desc: "Pick a convenient date and time that fits your schedule.",
  },
  {
    num: "03",
    icon: "✅",
    title: "Get Confirmed",
    desc: "Receive instant confirmation and reminders for your appointment.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Patient",
    text: "Booking was so easy! Found the right specialist in minutes. The AI chatbot even helped me understand my symptoms before the visit.",
    avatar: "👩‍💼",
  },
  {
    name: "Rahul Mehta",
    role: "Patient",
    text: "The admin panel is super smooth. All my appointments are tracked perfectly. Best healthcare app I've used.",
    avatar: "👨‍💻",
  },
  {
    name: "Anita Patel",
    role: "Patient",
    text: "I love how the AI assistant recommended the exact specialist I needed. Saved me so much time and worry.",
    avatar: "👩‍🔬",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("visible", e.isIntersecting),
        ),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />

        <div className="hero-content">
          <div className="hero-badge">🏥 Trusted by 50,000+ patients</div>
          <h1 className="hero-title">
            Your Health,
            <br />
            <span className="hero-gradient-text">Our Priority</span>
          </h1>
          <p className="hero-subtitle">
            Book appointments with top-rated doctors instantly.
            <br />
            AI-powered symptom guidance. Verified specialists. All in one place.
          </p>
          <div className="hero-actions">
            <Link to="/doctors" className="hero-btn-primary">
              Find a Doctor →
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="hero-btn-secondary">
                Get Started Free
              </Link>
            ) : (
              <Link to="/appointments" className="hero-btn-secondary">
                My Appointments
              </Link>
            )}
          </div>
          <div className="hero-trust">
            <span>✓ No registration fee</span>
            <span>✓ Instant confirmation</span>
            <span>✓ AI health assistant</span>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hero-float-card card-1">
          <span className="float-icon">✅</span>
          <div>
            <div className="float-title">Appointment Confirmed</div>
            <div className="float-sub">Dr. Emily Rodriguez · 10:00 AM</div>
          </div>
        </div>
        <div className="hero-float-card card-2">
          <span className="float-icon">🤖</span>
          <div>
            <div className="float-title">AI Recommendation</div>
            <div className="float-sub">See a Cardiologist</div>
          </div>
        </div>
        <div className="hero-float-card card-3">
          <span className="float-icon">⭐</span>
          <div>
            <div className="float-title">4.9 / 5 Rating</div>
            <div className="float-sub">From 12,000 reviews</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section reveal">
        <div className="stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section className="section reveal">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Specialties</span>
            <h2 className="section-title">Find Care for Every Need</h2>
            <p className="section-sub">
              From heart health to mental wellness — our doctors cover it all.
            </p>
          </div>
          <div className="specialty-grid">
            {specialties.map((sp) => (
              <Link to="/doctors" key={sp.name} className="specialty-card">
                <div className="specialty-icon">{sp.icon}</div>
                <div className="specialty-name">{sp.name}</div>
                <div className="specialty-desc">{sp.desc}</div>
                <div className="specialty-arrow">→</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/doctors" className="hero-btn-primary">
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section reveal">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Process</span>
            <h2 className="section-title">Book in 3 Simple Steps</h2>
            <p className="section-sub">
              Getting the right care has never been this easy.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={step.num} className="step-card">
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURE HIGHLIGHT ── */}
      <section className="ai-section reveal">
        <div className="section-inner">
          <div className="ai-card">
            <div className="ai-left">
              <span className="section-tag">AI-Powered</span>
              <h2 className="ai-title">Meet Your Health AI Assistant</h2>
              <p className="ai-desc">
                Not sure which doctor to see? Describe your symptoms to our AI
                health assistant and get an instant specialist recommendation —
                available 24/7, completely free.
              </p>
              <ul className="ai-features">
                <li>🩺 Symptom analysis & doctor suggestions</li>
                <li>💊 General health advice</li>
                <li>🚨 Emergency triage guidance</li>
                <li>📋 Pre-appointment preparation tips</li>
              </ul>
              {!isAuthenticated ? (
                <Link to="/register" className="hero-btn-primary">
                  Try AI Assistant Free →
                </Link>
              ) : (
                <button
                  className="hero-btn-primary"
                  onClick={() =>
                    document.querySelector(".chat-bubble-btn")?.click()
                  }
                >
                  Open AI Chat →
                </button>
              )}
            </div>
            <div className="ai-right">
              <div className="ai-chat-preview">
                <div className="ai-chat-header">
                  <span>🤖</span>
                  <span>HealthCare AI</span>
                  <span className="ai-online">● Online</span>
                </div>
                <div className="ai-msg ai-msg-bot">
                  👋 Hi! Describe your symptoms and I'll suggest the right
                  specialist for you.
                </div>
                <div className="ai-msg ai-msg-user">
                  I've been having chest pain and shortness of breath.
                </div>
                <div className="ai-msg ai-msg-bot">
                  Based on your symptoms, I recommend seeing a{" "}
                  <strong>Cardiologist</strong>. These could indicate a cardiac
                  condition. Book an appointment today! ❤️
                </div>
                <div className="ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section reveal">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-sub">Real experiences from real patients.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section reveal">
        <div className="cta-inner">
          <div className="cta-blob" />
          <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
          <p className="cta-sub">
            Join thousands of patients who trust HealthCare+ for their medical
            needs.
          </p>
          <div className="cta-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="cta-btn-primary">
                  Create Free Account
                </Link>
                <Link to="/contact" className="cta-btn-secondary">
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link to="/doctors" className="cta-btn-primary">
                  Find a Doctor Now
                </Link>
                <Link to="/appointments" className="cta-btn-secondary">
                  View Appointments
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
