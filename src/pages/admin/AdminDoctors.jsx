import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    experience: "",
    fees: "",
    phone: "",
    email: "",
    about: "",
  });

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.token || localStorage.getItem("token") || "";
    } catch {
      return "";
    }
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/doctors", {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setDoctors(data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editDoctor
      ? `http://localhost:5000/api/admin/doctors/${editDoctor._id}`
      : "http://localhost:5000/api/admin/doctors";
    const method = editDoctor ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      fetchDoctors();
      setShowForm(false);
      setEditDoctor(null);
      setForm({
        name: "",
        specialty: "",
        experience: "",
        fees: "",
        phone: "",
        email: "",
        about: "",
      });
    }
  };

  const handleEdit = (doctor) => {
    setEditDoctor(doctor);
    setForm({
      name: doctor.name,
      specialty: doctor.specialty,
      experience: doctor.experience,
      fees: doctor.fees,
      phone: doctor.phone,
      email: doctor.email,
      about: doctor.about,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    const res = await fetch(`http://localhost:5000/api/admin/doctors/${id}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) fetchDoctors();
  };

  const handleStatus = async (id, status) => {
    const res = await fetch(
      `http://localhost:5000/api/admin/doctors/${id}/status`,
      {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify({ status }),
      },
    );
    const data = await res.json();
    if (data.success) fetchDoctors();
  };

  const statusColor = {
    approved: "#10b981",
    pending: "#f59e0b",
    rejected: "#ef4444",
  };

  return (
    <AdminLayout>
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ color: "#1f2937" }}>👨‍⚕️ Doctors</h1>
            <p style={{ color: "#6b7280" }}>Manage all doctors</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditDoctor(null);
            }}
            className="btn btn-primary"
          >
            + Add Doctor
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              {editDoctor ? "✏️ Edit Doctor" : "➕ Add New Doctor"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "Full Name *",
                    name: "name",
                    type: "text",
                    placeholder: "Dr. John Smith",
                  },
                  {
                    label: "Specialty *",
                    name: "specialty",
                    type: "text",
                    placeholder: "Cardiologist",
                  },
                  {
                    label: "Experience (yrs)",
                    name: "experience",
                    type: "number",
                    placeholder: "10",
                  },
                  {
                    label: "Fees ($) *",
                    name: "fees",
                    type: "number",
                    placeholder: "150",
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "text",
                    placeholder: "+1 234-567-8900",
                  },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    placeholder: "dr@hospital.com",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.4rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="form-input"
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  About
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Doctor's bio and specialization..."
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary">
                  {editDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditDoctor(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors Table */}
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
          ) : doctors.length === 0 ? (
            <div
              style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}
            >
              No doctors yet. Click "Add Doctor" to get started!
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Doctor",
                    "Specialty",
                    "Exp",
                    "Fees",
                    "Status",
                    "Actions",
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
                {doctors.map((doc) => (
                  <tr key={doc._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "600" }}>{doc.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {doc.email}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        color: "#2563eb",
                        fontWeight: "500",
                      }}
                    >
                      {doc.specialty}
                    </td>
                    <td style={{ padding: "1rem", color: "#6b7280" }}>
                      {doc.experience}y
                    </td>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>
                      ${doc.fees}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          background:
                            (statusColor[doc.status] || "#6b7280") + "20",
                          color: statusColor[doc.status] || "#6b7280",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(doc)}
                          style={{
                            padding: "0.3rem 0.6rem",
                            background: "#eff6ff",
                            color: "#2563eb",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        {doc.status !== "approved" && (
                          <button
                            onClick={() => handleStatus(doc._id, "approved")}
                            style={{
                              padding: "0.3rem 0.6rem",
                              background: "#f0fdf4",
                              color: "#16a34a",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            ✅ Approve
                          </button>
                        )}
                        {doc.status !== "rejected" && (
                          <button
                            onClick={() => handleStatus(doc._id, "rejected")}
                            style={{
                              padding: "0.3rem 0.6rem",
                              background: "#fef9c3",
                              color: "#ca8a04",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            ❌ Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(doc._id)}
                          style={{
                            padding: "0.3rem 0.6rem",
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
                      </div>
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

export default AdminDoctors;
