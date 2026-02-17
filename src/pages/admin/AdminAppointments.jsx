import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.token || localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  };

  const headers = { Authorization: `Bearer ${getToken()}` };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/appointments", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    const res = await fetch(
      `http://localhost:5000/api/admin/appointments/${id}`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      },
    );
    const data = await res.json();
    if (data.success) fetchAppointments();
  };

  const statusColor = {
    scheduled: "#2563eb",
    completed: "#10b981",
    cancelled: "#ef4444",
  };

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>
          📅 Appointments
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          All appointments ({appointments.length} total)
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              Loading...
            </div>
          ) : appointments.length === 0 ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              No appointments yet.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Patient",
                    "Doctor",
                    "Date & Time",
                    "Reason",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.875rem 1rem",
                        textAlign: "left",
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "600" }}>
                        {apt.userId?.name || "Unknown"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {apt.userId?.email}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "500" }}>
                        {apt.doctorName || apt.doctorId?.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#2563eb" }}>
                        {apt.specialty || apt.doctorId?.specialty}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div>{new Date(apt.date).toLocaleDateString()}</div>
                      <div>{apt.time}</div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#6b7280",
                        maxWidth: "150px",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {apt.reason || "—"}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          background:
                            (statusColor[apt.status] || "#6b7280") + "20",
                          color: statusColor[apt.status] || "#6b7280",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => handleDelete(apt._id)}
                        style={{
                          padding: "0.3rem 0.75rem",
                          background: "#fef2f2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
