import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-image">👨‍⚕️</div>
      <div className="doctor-info">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <div className="doctor-details">
          <p>⭐ {doctor.rating} Rating</p>
          <p>💼 {doctor.experience} years experience</p>
          <p>💰 ${doctor.fees} consultation fee</p>
          <p>📅 Available: {doctor.availability.join(", ")}</p>
        </div>
        <Link
          to={`/book-appointment/${doctor.id}`}
          className="btn btn-primary"
          style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
