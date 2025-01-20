// const express = require("express");
// const Doctor = require("../models/Doctor");
// const { protect, isAdmin } = require("../utils/auth");

// const router = express.Router();

// // Create Doctor (Admin only)
// router.post("/", protect, isAdmin, async (req, res) => {
//   const { name, email, phone, specialization, availability_schedule } =
//     req.body;

//   try {
//     const doctorExists = await Doctor.findOne({ email });
//     if (doctorExists) {
//       return res.status(400).json({ message: "Doctor already exists" });
//     }

//     const doctor = new Doctor({
//       name,
//       email,
//       phone,
//       specialization,
//       availability_schedule,
//     });

//     await doctor.save();
//     res.status(201).json({ message: "Doctor created", doctor });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// // Get all Doctors (Protected)
// router.get("/", protect, async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.status(200).json(doctors);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// // Update Doctor (Admin only)
// router.put("/:doctorId", protect, isAdmin, async (req, res) => {
//   const { name, email, phone, specialization, availability_schedule } =
//     req.body;

//   try {
//     const doctor = await Doctor.findByIdAndUpdate(
//       req.params.doctorId,
//       {
//         name,
//         email,
//         phone,
//         specialization,
//         availability_schedule,
//         updated_at: Date.now(),
//       },
//       { new: true }
//     );

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.status(201).json({ message: "Doctor updated", doctor });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// // Delete Doctor (Admin only)
// router.delete("/:doctorId", protect, isAdmin, async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndDelete(req.params.doctorId);

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.status(200).json({ message: "Doctor deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// });

// module.exports = router;

const express = require("express");
const Doctor = require("../models/Doctor");
const { protect, isAdmin } = require("../utils/auth");
const User = require("../models/user");

const router = express.Router();

// Get all Doctors (Protected)
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// Update Doctor (Admin only)
router.put("/:doctorId", protect, isAdmin, async (req, res) => {
  const { name, email, phone, specialization, availability_schedule } =
    req.body;

  if (!name && !email && !phone && !specialization && !availability_schedule) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required to update",
    });
  }

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.doctorId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(specialization && { specialization }),
        ...(availability_schedule && { availability_schedule }),
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
