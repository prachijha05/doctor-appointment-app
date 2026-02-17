import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doctors } from "../utils/data";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const doctor = doctors.find((d) => d.id === parseInt(id));

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.token || localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time slot";
    if (!formData.reason)
      newErrors.reason = "Please describe your reason for visit";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.date && new Date(formData.date) < today) {
      newErrors.date = "Please select a future date";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          doctorId: doctor?.id?.toString() || null,
          doctorName: doctor?.name || "Unknown Doctor",
          specialty: doctor?.specialty || "General",
          fees: doctor?.fees || 0,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/appointments"), 2000);
      } else {
        setErrors({
          submit: data.message || "Booking failed. Please try again.",
        });
      }
    } catch (err) {
      setErrors({
        submit: "Server error. Make sure backend is running on port 5000.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2>Doctor not found</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/doctors")}
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#f0fdf4",
            borderRadius: "16px",
            border: "2px solid #86efac",
            maxWidth: "500px",
            margin: "2rem auto",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ color: "#166534", marginBottom: "0.5rem" }}>
            Appointment Booked!
          </h2>
          <p style={{ color: "#15803d" }}>
            Your appointment with <strong>{doctor.name}</strong> on{" "}
            <strong>{formData.date}</strong> at <strong>{formData.time}</strong>{" "}
            is confirmed.
          </p>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
            }}
          >
            Redirecting to My Appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 0" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Book Appointment</h2>

        {/* Doctor Info Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "3.5rem" }}>👨‍⚕️</div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{doctor.name}</h3>
            <p style={{ margin: "0.25rem 0", opacity: 0.85 }}>
              {doctor.specialty}
            </p>
            <p style={{ margin: 0, opacity: 0.75, fontSize: "0.875rem" }}>
              ⭐ {doctor.rating} Rating &nbsp;|&nbsp; 💼 {doctor.experience}{" "}
              years &nbsp;|&nbsp; 💰 ${doctor.fees} fee
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {errors.submit && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              ⚠️ {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Select Time Slot *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
                marginTop: "0.25rem",
              }}
            >
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData({ ...formData, time: slot })}
                  style={{
                    padding: "0.5rem 0.25rem",
                    border:
                      formData.time === slot
                        ? "2px solid #2563eb"
                        : "2px solid #e2e8f0",
                    borderRadius: "8px",
                    background: formData.time === slot ? "#eff6ff" : "white",
                    color: formData.time === slot ? "#2563eb" : "#374151",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Visit *</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Describe your symptoms or reason for visiting..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              style={{ resize: "vertical", minHeight: "100px" }}
            />
            {errors.reason && <p className="form-error">{errors.reason}</p>}
          </div>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              color: "#374151",
            }}
          >
            <strong>📋 Booking Summary:</strong>
            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span>👨‍⚕️ Doctor: {doctor.name}</span>
              <span>🏥 Specialty: {doctor.specialty}</span>
              {formData.date && <span>📅 Date: {formData.date}</span>}
              {formData.time && <span>🕐 Time: {formData.time}</span>}
              <span>💰 Consultation Fee: ${doctor.fees}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.875rem", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? "⏳ Booking..." : "✅ Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
