import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const { isAuthenticated }             = useAuth();
  const navigate                        = useNavigate();

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.token || localStorage.getItem('token') || '';
    } catch { return ''; }
  };

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAppointments();
  }, [isAuthenticated]);

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

  const statusStyle = (status) => ({
    scheduled: { bg: '#eff6ff', color: '#2563eb', label: '📅 Scheduled' },
    completed: { bg: '#f0fdf4', color: '#16a34a', label: '✅ Completed' },
    cancelled: { bg: '#fef2f2', color: '#dc2626', label: '❌ Cancelled' },
  }[status] || { bg: '#f3f4f6', color: '#6b7280', label: status });

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>My Appointments</h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
            + Book New
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            ⏳ Loading your appointments...
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', padding: '1rem',
            borderRadius: '8px', marginBottom: '1rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'white', borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No Appointments Yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Book your first appointment with one of our verified doctors.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
              Find a Doctor
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((apt) => {
            const s = statusStyle(apt.status);
            return (
              <div key={apt._id} style={{
                background: 'white', borderRadius: '12px', padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${s.color}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>👨‍⚕️</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>
                          {apt.doctorName}
                        </h3>
                        <span style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}>
                          {apt.specialty}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#6b7280', fontSize: '0.875rem' }}>
                      <span>📅 {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>🕐 {apt.time}</span>
                      {apt.fees > 0 && <span>💰 ${apt.fees}</span>}
                    </div>

                    {apt.reason && (
                      <p style={{ margin: '0.75rem 0 0', color: '#374151', fontSize: '0.875rem', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        📝 {apt.reason}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.3rem 0.75rem', borderRadius: '20px',
                      background: s.bg, color: s.color,
                      fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap',
                    }}>
                      {s.label}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancel(apt._id)}
                          style={{
                            padding: '0.3rem 0.75rem', background: '#fef3c7',
                            color: '#92400e', border: 'none', borderRadius: '6px',
                            cursor: 'pointer', fontSize: '0.8rem',
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(apt._id)}
                        style={{
                          padding: '0.3rem 0.75rem', background: '#fef2f2',
                          color: '#dc2626', border: 'none', borderRadius: '6px',
                          cursor: 'pointer', fontSize: '0.8rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;

