import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const StatCard = ({ icon, label, value, color }) => (
  <div
    style={{
      background: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    }}
  >
    <div
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "12px",
        background: color + "20",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.75rem",
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#1f2937" }}
      >
        {value}
      </div>
      <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.token || localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${getToken()}` },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem", color: "#1f2937" }}>
          📊 Dashboard
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Welcome back! Here's what's happening today.
        </p>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}
          >
            Loading stats...
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <StatCard
                icon="👥"
                label="Total Patients"
                value={stats?.stats?.totalUsers ?? 0}
                color="#2563eb"
              />
              <StatCard
                icon="👨‍⚕️"
                label="Total Doctors"
                value={stats?.stats?.totalDoctors ?? 0}
                color="#10b981"
              />
              <StatCard
                icon="📅"
                label="Total Appointments"
                value={stats?.stats?.totalAppointments ?? 0}
                color="#f59e0b"
              />
              <StatCard
                icon="⏳"
                label="Pending Doctors"
                value={stats?.stats?.pendingDoctors ?? 0}
                color="#ef4444"
              />
            </div>

            {/* Recent Users */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#1f2937" }}>
                👥 Recent Users
              </h3>
              {stats?.recentUsers?.length === 0 ? (
                <p style={{ color: "#6b7280" }}>No users yet.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Name", "Email", "Role", "Joined"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.75rem",
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
                    {stats?.recentUsers?.map((u) => (
                      <tr
                        key={u._id}
                        style={{ borderTop: "1px solid #f1f5f9" }}
                      >
                        <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                          {u.name}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                          {u.email}
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.6rem",
                              borderRadius: "20px",
                              background: "#eff6ff",
                              color: "#2563eb",
                              fontSize: "0.75rem",
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0.75rem",
                            color: "#6b7280",
                            fontSize: "0.875rem",
                          }}
                        >
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
