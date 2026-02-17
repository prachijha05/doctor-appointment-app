import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    experience: 12,
    rating: 4.8,
    fees: 150,
    phone: "+1-555-0101",
    email: "sarah.johnson@healthcare.com",
    about:
      "Expert cardiologist with 12 years experience in heart disease treatment.",
    availability: ["Mon", "Wed", "Fri"],
    status: "approved",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    experience: 8,
    rating: 4.6,
    fees: 120,
    phone: "+1-555-0102",
    email: "michael.chen@healthcare.com",
    about:
      "Specializes in skin disorders, cosmetic procedures and hair treatments.",
    availability: ["Tue", "Thu", "Sat"],
    status: "approved",
  },
  {
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    experience: 10,
    rating: 4.9,
    fees: 100,
    phone: "+1-555-0103",
    email: "emily.rodriguez@healthcare.com",
    about:
      "Dedicated pediatrician caring for children from newborns to teenagers.",
    availability: ["Mon", "Tue", "Thu"],
    status: "approved",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Orthopedic",
    experience: 15,
    rating: 4.7,
    fees: 180,
    phone: "+1-555-0104",
    email: "james.wilson@healthcare.com",
    about:
      "Orthopedic surgeon specializing in joint replacement and sports injuries.",
    availability: ["Mon", "Wed", "Fri"],
    status: "approved",
  },
  {
    name: "Dr. Priya Patel",
    specialty: "Neurologist",
    experience: 11,
    rating: 4.8,
    fees: 200,
    phone: "+1-555-0105",
    email: "priya.patel@healthcare.com",
    about:
      "Neurologist specializing in migraines, epilepsy and neurological disorders.",
    availability: ["Tue", "Thu"],
    status: "approved",
  },
  {
    name: "Dr. Robert Kim",
    specialty: "General Physician",
    experience: 7,
    rating: 4.5,
    fees: 80,
    phone: "+1-555-0106",
    email: "robert.kim@healthcare.com",
    about:
      "General physician providing comprehensive primary care for all ages.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "approved",
  },
  {
    name: "Dr. Lisa Thompson",
    specialty: "Gynecologist",
    experience: 9,
    rating: 4.7,
    fees: 130,
    phone: "+1-555-0107",
    email: "lisa.thompson@healthcare.com",
    about:
      "Women's health specialist with expertise in obstetrics and gynecology.",
    availability: ["Mon", "Wed", "Fri"],
    status: "approved",
  },
  {
    name: "Dr. David Park",
    specialty: "Psychiatrist",
    experience: 13,
    rating: 4.6,
    fees: 160,
    phone: "+1-555-0108",
    email: "david.park@healthcare.com",
    about:
      "Psychiatrist specializing in anxiety, depression and cognitive therapy.",
    availability: ["Tue", "Thu", "Sat"],
    status: "approved",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/doctor-appointment",
    );
    console.log("✅ MongoDB connected");

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log("🗑️  Old doctors cleared");

    // Insert new doctors
    await Doctor.insertMany(doctors);
    console.log(`✅ ${doctors.length} doctors seeded successfully!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();
