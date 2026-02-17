import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🏥 HealthCare
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={`navbar-link ${isActive("/")}`}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/doctors"
              className={`navbar-link ${isActive("/doctors")}`}
            >
              Doctors
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link
                to="/appointments"
                className={`navbar-link ${isActive("/appointments")}`}
              >
                My Appointments
              </Link>
            </li>
          )}
          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${isActive("/login")}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="navbar-link">👤 {user.name}</span>
              </li>
              <li>
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
