import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.user.role === "admin") {
        const userWithToken = {
          ...data.user,
          token: data.token,
        };

        login(userWithToken);

        console.log("ADMIN LOGIN:", userWithToken); // debug

        navigate("/admin/dashboard");
      } else if (data.success && data.user.role !== "admin") {
        setError("Access denied. Admin accounts only.");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e40af, #2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>🏥</div>
          <h2 style={{ color: "#1e40af", marginBottom: "0.25rem" }}>
            Admin Panel
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            HealthCare Management System
          </p>
        </div>

        {error && (
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
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@healthcare.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "🔐 Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
