import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { doctorId, doctorName, specialty, date, time, reason, fees } =
      req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required",
      });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId: doctorId || null,
      doctorName: doctorName || "Unknown Doctor",
      specialty: specialty || "General",
      date,
      time,
      reason: reason || "",
      fees: fees || 0,
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get logged-in user's appointments
// @route   GET /api/appointments
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
