import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.token || localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  };

  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) fetchUsers();
  };

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>👥 Users</h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Manage all registered patients ({users.length} total)
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
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              No users registered yet.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Provider",
                    "Joined",
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
                {users.map((u) => (
                  <tr key={u._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>
                      {u.name}
                    </td>
                    <td style={{ padding: "1rem", color: "#6b7280" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "1rem", color: "#6b7280" }}>
                      {u.phone || "—"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "20px",
                          background:
                            u.authProvider === "google" ? "#fef9c3" : "#eff6ff",
                          color:
                            u.authProvider === "google" ? "#ca8a04" : "#2563eb",
                          fontSize: "0.75rem",
                        }}
                      >
                        {u.authProvider === "google" ? "🔵 Google" : "📧 Email"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => handleDelete(u._id)}
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

export default AdminUsers;
