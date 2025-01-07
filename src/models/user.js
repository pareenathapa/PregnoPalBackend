const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  picture: {
    type: String,
    default:
      "https://c8.alamy.com/zooms/9/9c30002a90914b58b785a537a39421ba/2c80ydc.jpg",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
