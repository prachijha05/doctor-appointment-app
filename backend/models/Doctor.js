import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
    },
    experience: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    fees: {
      type: Number,
      required: [true, "Consultation fee is required"],
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    availability: {
      type: [String],
      default: ["Mon", "Wed", "Fri"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
