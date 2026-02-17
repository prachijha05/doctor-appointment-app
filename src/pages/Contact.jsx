import { useState } from 'react';
import { Link } from 'react-router-dom';

const contactInfo = [
  { icon: '📍', title: 'Our Address',    value: '123 Health Street, Medical District, Mumbai - 400001' },
  { icon: '📞', title: 'Phone Number',   value: '+91 98765 43210' },
  { icon: '📧', title: 'Email Address',  value: 'support@healthcare-plus.com' },
  { icon: '🕐', title: 'Working Hours',  value: 'Mon – Sat: 9:00 AM – 8:00 PM' },
];

const faqs = [
  { q: 'How do I book an appointment?',       a: 'Go to the Doctors page, choose a specialist, pick a date and time, and confirm. It takes less than 2 minutes!' },
  { q: 'Is my health data safe?',             a: 'Yes. We use JWT authentication, bcrypt password hashing, and all data is stored securely in MongoDB.' },
  { q: 'Can I cancel my appointment?',        a: 'Absolutely. Go to "My Appointments", find the booking and click Cancel. You can also delete it entirely.' },
  { q: 'What is the AI health assistant?',    a: 'It\'s a free AI chatbot (powered by Groq Llama 3) that helps you identify symptoms and suggests the right specialist to see.' },
  { q: 'Is registration free?',               a: 'Yes! Creating an account and booking appointments is completely free. You only pay the doctor\'s consultation fee.' },
];

const Contact = () => {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0F172A' }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A, #1E3A8A)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)', color: '#BAE6FD',
            padding: '0.4rem 1.25rem', borderRadius: '100px', fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}>
            💬 We're here to help
          </span>
          <h1 style={{
            fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'white', marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Get in Touch
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto' }}>
            Have a question or need help? Our support team is available 6 days a week.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section style={{ padding: '4rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {contactInfo.map((c) => (
              <div key={c.title} style={{
                background: 'white', borderRadius: '16px',
                padding: '1.75rem', textAlign: 'center',
                border: '1.5px solid #E2E8F0',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: '#1E3A8A' }}>{c.title}</div>
                <div style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + MAP ── */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Form */}
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Send Us a Message
            </h2>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>We'll get back to you within 24 hours.</p>

            {submitted ? (
              <div style={{
                background: '#F0FDF4', border: '2px solid #86EFAC',
                borderRadius: '16px', padding: '3rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: '#15803D' }}>Thanks for reaching out! We'll reply within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); }}
                  style={{
                    marginTop: '1.5rem', padding: '0.75rem 2rem',
                    background: '#2563EB', color: 'white', border: 'none',
                    borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Subject *</label>
                  <select
                    className="form-input"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="">Select a subject...</option>
                    <option>Appointment Issue</option>
                    <option>Technical Support</option>
                    <option>Doctor Inquiry</option>
                    <option>Account Help</option>
                    <option>Feedback / Suggestion</option>
                    <option>Other</option>
                  </select>
                  {errors.subject && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.subject}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Message *</label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ resize: 'vertical', minHeight: '130px' }}
                  />
                  {errors.message && <p style={{ color: '#DC2626', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.9rem', background: 'linear-gradient(135deg,#38BDF8,#2563EB)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                    transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {loading ? '⏳ Sending...' : '📨 Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right side — map placeholder + quick links */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #0F172A, #1E3A8A)',
              borderRadius: '20px', padding: '2.5rem', color: 'white',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                🏥 Quick Support
              </h3>
              {[
                { icon: '📅', label: 'Book an appointment',   to: '/doctors'      },
                { icon: '📋', label: 'View my appointments',  to: '/appointments' },
                { icon: '🤖', label: 'Talk to AI assistant',  to: '/'             },
                { icon: '👨‍⚕️', label: 'Browse all doctors',   to: '/doctors'      },
              ].map((item) => (
                <Link key={item.label} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.875rem 1rem', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)', marginBottom: '0.625rem',
                  color: 'white', textDecoration: 'none',
                  transition: 'background 0.2s',
                  fontSize: '0.95rem',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  <span style={{ marginLeft: 'auto', opacity: 0.6 }}>→</span>
                </Link>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{
              background: '#EFF6FF', borderRadius: '16px', padding: '2rem',
              textAlign: 'center', border: '1.5px dashed #93C5FD',
              minHeight: '200px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            }}>
              <div style={{ fontSize: '3rem' }}>📍</div>
              <div style={{ fontWeight: 700, color: '#1E3A8A' }}>Find Us on Map</div>
              <div style={{ color: '#64748B', fontSize: '0.875rem' }}>123 Health Street, Medical District, Mumbai</div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: '0.5rem', padding: '0.6rem 1.5rem',
                  background: '#2563EB', color: 'white', borderRadius: '8px',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
                }}
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '4rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              display: 'inline-block', background: '#EFF6FF', color: '#2563EB',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.35rem 1rem', borderRadius: '100px',
              marginBottom: '1rem',
            }}>FAQ</span>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', marginBottom: '0.75rem',
              border: `1.5px solid ${openFaq === i ? '#2563EB' : '#E2E8F0'}`,
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '1.25rem 1.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span>{faq.q}</span>
                <span style={{
                  fontSize: '1.25rem', color: '#2563EB',
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s', flexShrink: 0, marginLeft: '1rem',
                }}>
                  ↓
                </span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 1.5rem 1.25rem',
                  color: '#64748B', fontSize: '0.925rem', lineHeight: 1.7,
                  borderTop: '1px solid #F1F5F9',
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Contact;
