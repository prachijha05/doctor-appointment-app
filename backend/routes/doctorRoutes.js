import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// @desc   Get all approved doctors (public)
// @route  GET /api/doctors
// @access Public
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc   Get single doctor
// @route  GET /api/doctors/:id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
