import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: String, // ← Changed from ObjectId to String
      default: null, // ← Not required
    },
    doctorName: { type: String, default: "" },
    specialty: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: "" },
    fees: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
