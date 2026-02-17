import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/doctors", icon: "👨‍⚕️", label: "Doctors" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/appointments", icon: "📅", label: "Appointments" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "linear-gradient(180deg, #1e40af, #1e3a8a)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            🏥 HealthCare
          </div>
          <div
            style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.25rem" }}
          >
            Admin Panel
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "1rem 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1.5rem",
                color: "white",
                textDecoration: "none",
                background:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                borderLeft:
                  location.pathname === item.path
                    ? "3px solid white"
                    : "3px solid transparent",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.5rem" }}
          >
            👤 {user?.name}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    </div>
  );
};

export default AdminLayout;
