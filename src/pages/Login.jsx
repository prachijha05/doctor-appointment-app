import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/doctors");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        const userWithToken = {
          ...data.user,
          token: data.token,
        };

        login(userWithToken);

        // ✅ Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/doctors");
        }
      } else {
        setServerError(data.message || "Login failed");
      }
    } catch (err) {
      setServerError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Login to Your Account</h2>

        {serverError && (
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>

            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />

            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
            />

            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="form-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
