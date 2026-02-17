import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doctors, timeSlots } from "../utils/data";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const foundDoctor = doctors.find((d) => d.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      navigate("/doctors");
    }
  }, [id, isAuthenticated, navigate]);

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

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time slot";
    }

    if (!formData.reason) {
      newErrors.reason = "Please provide a reason for appointment";
    } else if (formData.reason.length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      // Save appointment to localStorage
      const appointment = {
        id: Date.now(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      };

      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]",
      );
      existingAppointments.push(appointment);
      localStorage.setItem(
        "appointments",
        JSON.stringify(existingAppointments),
      );

      alert("Appointment booked successfully!");
      navigate("/appointments");
    } else {
      setErrors(newErrors);
    }
  };

  if (!doctor) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 className="mb-2">Book Appointment</h2>

        <div
          className="doctor-info mb-2"
          style={{
            padding: "1rem",
            backgroundColor: "var(--bg-light)",
            borderRadius: "8px",
          }}
        >
          <h3>{doctor.name}</h3>
          <p className="doctor-specialty">{doctor.specialty}</p>
          <p>
            ⭐ {doctor.rating} Rating | 💰 ${doctor.fees} consultation fee
          </p>
          <p>
            📞 {doctor.phone} | ✉️ {doctor.email}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="time">
              Select Time Slot
            </label>
            <select
              id="time"
              name="time"
              className="form-select"
              value={formData.time}
              onChange={handleChange}
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reason">
              Reason for Appointment
            </label>
            <textarea
              id="reason"
              name="reason"
              className="form-textarea"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for consultation..."
            />
            {errors.reason && <p className="form-error">{errors.reason}</p>}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Confirm Appointment
            </button>
            <button
              type="button"
              onClick={() => navigate("/doctors")}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
