import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import { doctors } from "../utils/data";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSpecialty] = useState("All");
  const navigate = useNavigate();

  const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="container">
      <div style={{ padding: "2rem 0" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Find a Doctor</h2>
          <p style={{ color: "#6b7280" }}>
            Browse our network of verified healthcare professionals
          </p>
        </div>

        {/* Search + Filter */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <select
            className="form-input"
            value={selectedSpecialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{ width: "200px" }}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Showing {filtered.length} of {doctors.length} doctors
        </p>

        {/* Doctor Cards */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "white",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>No doctors found</h3>
            <p style={{ color: "#6b7280" }}>
              Try a different search or specialty filter
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setSearchTerm("");
                setSpecialty("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="doctors-grid">
            {filtered.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={() => navigate(`/book-appointment/${doctor.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
