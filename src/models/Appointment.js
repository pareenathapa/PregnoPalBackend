const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  appointment_date: { type: Date, required: true },
  mode: { type: String, enum: ["Physical", "Online"], required: true },
  meeting_link: {
    type: String,
    required: function () {
      return this.mode === "Online";
    },
  },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Countered"],
    default: "Pending",
  },
  counter_proposal_date: { type: Date, default: null },
  counter_mode: { type: String, enum: ["Physical", "Online"], default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  description: { type: String, default: "" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
