const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Child = require("../models/child");
const { generateToken, protect } = require("../utils/auth");
const upload = require("../utils/upload");

const router = express.Router();

// Register User
router.post("/register", upload.single("picture"), async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    specialization,
    available_from,
    available_to,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    picture = req.file ? `/uploads/${req.file.filename}` : null;

    // if picture is not provided, use the default picture
    if (!picture) {
      picture =
        "https://c8.alamy.com/zooms/9/9c30002a90914b58b785a537a39421ba/2c80ydc.jpg";
    }
    if (role === "doctor") {
      if (!specialization || !available_from || !available_to) {
        return res
          .status(400)
          .json({ message: "Please provide specialization and availability" });
      }
    }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      picture,
      role,
      specialization,
      available_from,
      available_to,
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    const userWithoutPassword = { ...user._doc, password: undefined, token };
    // Convert all the date to millisecondsSinceEpoch
    userWithoutPassword.created_at = userWithoutPassword.created_at.getTime();
    userWithoutPassword.updated_at = userWithoutPassword.updated_at.getTime();
    userWithoutPassword.available_from =
      userWithoutPassword.available_from.getTime();
    userWithoutPassword.available_to =
      userWithoutPassword.available_to.getTime();
    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Get User Info with Token and Child Info
router.get("/me", protect, async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user);

    const token = generateToken(user._id);
    const userWithToken = { ...user._doc, token };
    console.log(userWithToken);
    if (user.role != "doctor") {
      const children = await Child.find({ parent_id: req.user });
      // Convert all the date to millisecondsSinceEpoch
      userWithToken.created_at = userWithToken.created_at.getTime();
      userWithToken.updated_at = userWithToken.updated_at.getTime();
      userWithToken.available_from = userWithToken.available_from.getTime();
      userWithToken.available_to = userWithToken.available_to.getTime();

      res.status(200).json({ user: userWithToken, children });
    } else {
      // Convert all the date to millisecondsSinceEpoch
      userWithToken.created_at = userWithToken.created_at.getTime();
      userWithToken.updated_at = userWithToken.updated_at.getTime();
      userWithToken.available_from = userWithToken.available_from.getTime();
      userWithToken.available_to = userWithToken.available_to.getTime();
      res.status(200).json({ user: userWithToken });
    }
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Create Child (Requires User Authentication)
router.post("/child", protect, async (req, res) => {
  const { name, date_of_birth, sex, height, weight } = req.body;

  // Parse Date (0/12/2024)
  const date = date_of_birth.split("/");
  const dob = new Date(date[2], date[1] - 1, date[0]);

  try {
    const child = new Child({
      name,
      sex,
      height,
      weight,
      parent_id: req.user,
      date_of_birth: dob,
    });

    await child.save();
    res.status(201).json({ message: "Child created", child });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Get User's Children
router.get("/children", protect, async (req, res) => {
  try {
    const children = await Child.find({ parent_id: req.user });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Update User Info
router.put("/me", protect, upload.single("picture"), async (req, res) => {
  const { name, email } = req.body;

  try {
    const picture = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {
      name,
      email,
      updated_at: Date.now(),
    };

    if (picture) updateData.picture = picture;

    const user = await User.findByIdAndUpdate(req.user, updateData, {
      new: true,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

// Delete User
router.delete("/delete", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err}` });
  }
});

module.exports = router;
