import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorStatus,
  getAllAppointments,
  deleteAppointment,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected by JWT + admin role
router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/doctors", getAllDoctors);
router.post("/doctors", addDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);
router.put("/doctors/:id/status", updateDoctorStatus);
router.get("/appointments", getAllAppointments);
router.delete("/appointments/:id", deleteAppointment);

export default router;
