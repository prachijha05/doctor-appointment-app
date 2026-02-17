import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyAppointments.css';

const specialtyIcons = {
  Cardiologist:        '❤️',
  Dermatologist:       '🔬',
  Pediatrician:        '👶',
  Orthopedic:          '🦴',
  Neurologist:         '🧠',
  'General Physician': '🩺',
  Gynecologist:        '🌸',
  Psychiatrist:        '🧬',
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('all');
  const { isAuthenticated }             = useAuth();
  const navigate                        = useNavigate();

  // ── Exact same token logic as before ──
  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.token || localStorage.getItem('token') || '';
    } catch { return ''; }
  };

  // ── Exact same fetch logic as before ──
  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.message || 'Failed to load appointments');
      }
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchAppointments();
  }, [isAuthenticated]);

  // ── Exact same cancel logic as before ──
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) fetchAppointments();
    } catch { alert('Error cancelling appointment'); }
  };

  // ── Exact same delete logic as before ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) fetchAppointments();
    } catch { alert('Error deleting appointment'); }
  };

  // ── Filter tabs ──
  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const counts = {
    all:       appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const statusConfig = {
    scheduled: { bg: '#EFF6FF', color: '#2563EB', label: 'Scheduled',  dot: '#2563EB' },
    completed: { bg: '#F0FDF4', color: '#16A34A', label: 'Completed',  dot: '#16A34A' },
    cancelled: { bg: '#FEF2F2', color: '#DC2626', label: 'Cancelled',  dot: '#DC2626' },
  };

  return (
    <div className="apt-page">

      {/* ── HEADER BANNER ── */}
      <section className="apt-hero">
        <div className="apt-hero-bg" />
        <div className="apt-hero-inner">
          <div className="apt-hero-left">
            <span className="apt-hero-tag">📋 Your Health Journey</span>
            <h1 className="apt-hero-title">My Appointments</h1>
            <p className="apt-hero-sub">
              Track, manage and review all your bookings in one place.
            </p>
          </div>
          <div className="apt-hero-right">
            <div className="apt-hero-stat">
              <div className="apt-hero-stat-num">{counts.all}</div>
              <div className="apt-hero-stat-label">Total</div>
            </div>
            <div className="apt-hero-stat">
              <div className="apt-hero-stat-num" style={{ color: '#38BDF8' }}>{counts.scheduled}</div>
              <div className="apt-hero-stat-label">Upcoming</div>
            </div>
            <div className="apt-hero-stat">
              <div className="apt-hero-stat-num" style={{ color: '#34D399' }}>{counts.completed}</div>
              <div className="apt-hero-stat-label">Done</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="apt-content">

        {/* Toolbar */}
        <div className="apt-toolbar">
          <div className="apt-filter-tabs">
            {['all', 'scheduled', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                className={`apt-tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="apt-tab-count">{counts[tab]}</span>
              </button>
            ))}
          </div>
          <button
            className="apt-book-new"
            onClick={() => navigate('/doctors')}
          >
            + Book New
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="apt-loading">
            <div className="apt-spinner" />
            <p>Loading your appointments...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="apt-error">
            ⚠️ {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="apt-empty">
            <div className="apt-empty-icon">
              {filter === 'all' ? '📅' : filter === 'scheduled' ? '🗓️' : filter === 'completed' ? '✅' : '❌'}
            </div>
            <h3>
              {filter === 'all'
                ? 'No appointments yet'
                : `No ${filter} appointments`}
            </h3>
            <p>
              {filter === 'all'
                ? 'Book your first appointment with one of our verified doctors.'
                : `You have no ${filter} appointments right now.`}
            </p>
            {filter === 'all' && (
              <button className="apt-book-new" onClick={() => navigate('/doctors')}>
                Find a Doctor
              </button>
            )}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="apt-list">
            {filtered.map((apt, index) => {
              const s   = statusConfig[apt.status] || { bg: '#F3F4F6', color: '#6B7280', label: apt.status, dot: '#6B7280' };
              const icon = specialtyIcons[apt.specialty] || '👨‍⚕️';

              return (
                <div
                  key={apt._id}
                  className="apt-card"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Left accent bar */}
                  <div className="apt-card-bar" style={{ background: s.dot }} />

                  {/* Doctor avatar */}
                  <div className="apt-card-avatar">
                    <span>{icon}</span>
                  </div>

                  {/* Main info */}
                  <div className="apt-card-info">
                    <div className="apt-card-header">
                      <div>
                        <h3 className="apt-card-name">{apt.doctorName}</h3>
                        <span className="apt-card-spec">{apt.specialty}</span>
                      </div>
                      <span
                        className="apt-status-badge"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <span
                          className="apt-status-dot"
                          style={{ background: s.dot }}
                        />
                        {s.label}
                      </span>
                    </div>

                    <div className="apt-card-meta">
                      <div className="apt-meta-item">
                        <span className="apt-meta-icon">📅</span>
                        <span>
                          {new Date(apt.date).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric',
                            month: 'short',  day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="apt-meta-item">
                        <span className="apt-meta-icon">🕐</span>
                        <span>{apt.time}</span>
                      </div>
                      {apt.fees > 0 && (
                        <div className="apt-meta-item">
                          <span className="apt-meta-icon">💰</span>
                          <span>${apt.fees} fee</span>
                        </div>
                      )}
                    </div>

                    {apt.reason && (
                      <div className="apt-card-reason">
                        <span className="apt-reason-icon">📝</span>
                        <span>{apt.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="apt-card-actions">
                    {apt.status === 'scheduled' && (
                      <button
                        className="apt-btn-cancel"
                        onClick={() => handleCancel(apt._id)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="apt-btn-delete"
                      onClick={() => handleDelete(apt._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
