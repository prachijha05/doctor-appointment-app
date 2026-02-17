import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin only
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "patient" });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ status: "pending" });

    const recentUsers = await User.find({ role: "patient" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("doctorId", "name specialty");

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
      },
      recentUsers,
      recentAppointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin only
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete admin user" });
    }

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Admin only
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new doctor
// @route   POST /api/admin/doctors
// @access  Admin only
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      experience,
      fees,
      phone,
      email,
      about,
      availability,
    } = req.body;

    if (!name || !specialty || !fees) {
      return res.status(400).json({
        success: false,
        message: "Name, specialty and fees are required",
      });
    }

    const doctor = await Doctor.create({
      name,
      specialty,
      experience: experience || 0,
      fees,
      phone: phone || "",
      email: email || "",
      about: about || "",
      availability: availability || ["Mon", "Wed", "Fri"],
      status: "approved",
      rating: 4.5,
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Admin only
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Admin only
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject doctor
// @route   PUT /api/admin/doctors/:id/status
// @access  Admin only
export const updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: `Doctor ${status} successfully`,
      doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Admin only
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("doctorId", "name specialty fees");

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
// @access  Admin only
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
