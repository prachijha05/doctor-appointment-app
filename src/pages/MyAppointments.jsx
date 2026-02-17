import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load appointments from localStorage
    const savedAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]",
    );
    setAppointments(savedAppointments);
  }, [isAuthenticated, navigate]);

  const handleCancel = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
      );
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    }
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const updatedAppointments = appointments.filter(
        (apt) => apt.id !== appointmentId,
      );
      setAppointments(updatedAppointments);
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "var(--secondary-color)";
      case "completed":
        return "var(--primary-color)";
      case "cancelled":
        return "var(--danger-color)";
      default:
        return "var(--text-light)";
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="container">
        <h1 className="text-center mb-2">My Appointments</h1>
        <div className="card text-center" style={{ padding: "3rem" }}>
          <h3>No appointments found</h3>
          <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>
            You haven't booked any appointments yet
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="btn btn-primary"
          >
            Book an Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center mb-2">My Appointments</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "0.5rem" }}>
                  {appointment.doctorName}
                </h3>
                <p className="doctor-specialty">{appointment.specialty}</p>
              </div>
              <span
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  backgroundColor: getStatusColor(appointment.status) + "20",
                  color: getStatusColor(appointment.status),
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  textTransform: "capitalize",
                }}
              >
                {appointment.status}
              </span>
            </div>

            <div style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
              <p>
                📅 Date:{" "}
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>🕐 Time: {appointment.time}</p>
              <p>📝 Reason: {appointment.reason}</p>
            </div>

            {appointment.status === "scheduled" && (
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="btn btn-secondary"
                >
                  Cancel Appointment
                </button>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "2px solid var(--danger-color)",
                    borderRadius: "8px",
                    backgroundColor: "transparent",
                    color: "var(--danger-color)",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            {appointment.status === "cancelled" && (
              <button
                onClick={() => handleDelete(appointment.id)}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "2px solid var(--danger-color)",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "var(--danger-color)",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
