const express = require("express");
const Appointment = require("../models/Appointment");
const { protect } = require("../utils/auth");

const router = express.Router();

// Get Appointments for a Specific Date
// Get All Appointment Dates and Times
router.get("/dates-and-times", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ parent_id: req.user })
      .populate("doctor_id")
      .populate("child_id");

    const appointmentDatesAndTimes = appointments.map((appointment) => {
      return {
        id: appointment._id,
        date: appointment.appointment_date.toISOString().split("T")[0], // Get date in YYYY-MM-DD format
        time: appointment.appointment_date.toISOString().split("T")[1], // Get time in HH:mm:ss format
        doctor: appointment.doctor_id,
        child: appointment.child_id,
        mode: appointment.mode,
        status: appointment.status,
        title: appointment.title,
      };
    });

    res.json(appointmentDatesAndTimes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create Appointment
router.post("/", protect, async (req, res) => {
  const {
    doctor_id,
    child_id,
    appointment_date,
    mode,
    meeting_link,
    description,
    title,
  } = req.body;
  try {
    const appointment = new Appointment({
      title,
      parent_id: req.user, // The logged-in user is the parent
      doctor_id,
      child_id,
      appointment_date,
      mode,
      description,
      meeting_link: mode === "Online" ? meeting_link : null,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Appointments (Protected)
router.get("/", protect, async (req, res) => {
  try {
    // sort newest to oldest
    const appointments = await Appointment.find({ parent_id: req.user })
      .populate("doctor_id", "name specialization")
      .populate("child_id", "name date_of_birth")
      .sort({ appointment_date: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Single Appointment (Protected)
router.get("/:appointmentId", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      parent_id: req.user,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Appointment (Protected)
router.put("/:appointmentId", protect, async (req, res) => {
  const { status, counter_proposal_date, counter_mode, description } = req.body;

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.appointmentId, parent_id: req.user },
      {
        status,
        description,
        counter_proposal_date:
          status === "Countered" ? counter_proposal_date : null,
        counter_mode: status === "Countered" ? counter_mode : null,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(201).json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Appointment (Protected)
router.delete("/:appointmentId", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.appointmentId,
      parent_id: req.user,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
