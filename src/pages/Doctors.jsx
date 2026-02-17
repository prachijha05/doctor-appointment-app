import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctors } from "../utils/data";
import "./Doctors.css";

const specialtyIcons = {
  Cardiologist:     "❤️",
  Dermatologist:    "🔬",
  Pediatrician:     "👶",
  Orthopedic:       "🦴",
  Neurologist:      "🧠",
  "General Physician": "🩺",
  Gynecologist:     "🌸",
  Psychiatrist:     "🧬",
};

const DoctorCard = ({ doctor, onBook }) => {
  const icon = specialtyIcons[doctor.specialty] || "👨‍⚕️";
  const stars = Math.round(doctor.rating);

  return (
    <div className="doc-card">
      {/* Card top */}
      <div className="doc-card-top">
        <div className="doc-avatar">{icon}</div>
        <div className="doc-badge">✓ Verified</div>
      </div>

      {/* Card body */}
      <div className="doc-card-body">
        <h3 className="doc-name">{doctor.name}</h3>
        <span className="doc-specialty">{doctor.specialty}</span>

        <div className="doc-rating">
          {"★".repeat(stars)}{"☆".repeat(5 - stars)}
          <span className="doc-rating-num">{doctor.rating}</span>
        </div>

        <div className="doc-meta">
          <div className="doc-meta-item">
            <span className="doc-meta-icon">💼</span>
            <span>{doctor.experience} yrs exp</span>
          </div>
          <div className="doc-meta-item">
            <span className="doc-meta-icon">💰</span>
            <span>${doctor.fees} fee</span>
          </div>
        </div>

        <div className="doc-avail">
          <span className="doc-avail-label">Available:</span>
          <div className="doc-avail-days">
            {(doctor.availability || ["Mon","Wed","Fri"]).map((day) => (
              <span key={day} className="doc-day">{day}</span>
            ))}
          </div>
        </div>

        <button className="doc-book-btn" onClick={onBook}>
          Book Appointment →
        </button>
      </div>
    </div>
  );
};

const Doctors = () => {
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedSpecialty, setSpecialty] = useState("All");
  const [view, setView]                   = useState("grid"); // grid | list
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
    <div className="doctors-page">

      {/* ── HERO BANNER ── */}
      <section className="doctors-hero">
        <div className="doctors-hero-bg" />
        <div className="doctors-hero-content">
          <span className="doctors-hero-tag">🏥 500+ Verified Doctors</span>
          <h1 className="doctors-hero-title">Find Your Perfect <br /><span className="doctors-hero-accent">Specialist</span></h1>
          <p className="doctors-hero-sub">
            Search from our network of top-rated, verified healthcare professionals.
          </p>
        </div>

        {/* Stats row */}
        <div className="doctors-hero-stats">
          {[
            { val: "8+", label: "Specialties" },
            { val: "4.8★", label: "Avg Rating" },
            { val: "24h", label: "Booking" },
            { val: "100%", label: "Verified" },
          ].map((s) => (
            <div key={s.label} className="doctors-hero-stat">
              <div className="dhs-val">{s.val}</div>
              <div className="dhs-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH + FILTER ── */}
      <section className="doctors-search-section">
        <div className="doctors-search-inner">
          <div className="search-bar-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="doctors-search-input"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >✕</button>
            )}
          </div>

          <div className="filter-chips">
            {specialties.map((s) => (
              <button
                key={s}
                className={`filter-chip ${selectedSpecialty === s ? "active" : ""}`}
                onClick={() => setSpecialty(s)}
              >
                {specialtyIcons[s] && <span>{specialtyIcons[s]}</span>}
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="doctors-results">
        <div className="doctors-results-inner">
          {/* Results header */}
          <div className="results-header">
            <div className="results-count">
              {filtered.length === 0
                ? "No results"
                : <><strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? "s" : ""} found
                  {selectedSpecialty !== "All" && <span className="results-filter-tag"> in {selectedSpecialty}</span>}
                </>
              }
            </div>
            <div className="view-toggle">
              <button
                className={`view-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
                title="Grid view"
              >⊞</button>
              <button
                className={`view-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
                title="List view"
              >☰</button>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="doctors-empty">
              <div className="doctors-empty-icon">🔍</div>
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className="doc-book-btn"
                style={{ display: "inline-block", marginTop: "1rem" }}
                onClick={() => { setSearchTerm(""); setSpecialty("All"); }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={view === "grid" ? "doc-grid" : "doc-list"}>
              {filtered.map((doctor) =>
                view === "grid" ? (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBook={() => navigate(`/book-appointment/${doctor.id}`)}
                  />
                ) : (
                  /* List view row */
                  <div key={doctor.id} className="doc-list-row">
                    <div className="doc-list-avatar">
                      {specialtyIcons[doctor.specialty] || "👨‍⚕️"}
                    </div>
                    <div className="doc-list-info">
                      <div className="doc-list-name">{doctor.name}</div>
                      <div className="doc-list-spec">{doctor.specialty}</div>
                      <div className="doc-list-meta">
                        <span>⭐ {doctor.rating}</span>
                        <span>💼 {doctor.experience}y exp</span>
                        <span>💰 ${doctor.fees}</span>
                      </div>
                    </div>
                    <div className="doc-list-avail">
                      {(doctor.availability || ["Mon","Wed","Fri"]).map((d) => (
                        <span key={d} className="doc-day">{d}</span>
                      ))}
                    </div>
                    <button
                      className="doc-book-btn"
                      style={{ flexShrink: 0 }}
                      onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                    >
                      Book →
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
