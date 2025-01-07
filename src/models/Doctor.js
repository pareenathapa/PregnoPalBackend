const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  availability_schedule: { type: String, required: true }, // Example: "Mon-Fri: 9 AM - 5 PM"
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  picture: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color-119556416.jpg",
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
