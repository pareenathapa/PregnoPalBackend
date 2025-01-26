const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create a new notification
router.post("/", async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({
      to: req.user,
    })
      .populate("child_id")
      .populate("parent_id")
      .populate("doctor_id")
      .populate("appointment_id")
      .populate("to");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a notification by ID
router.get("/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate("child_id")
      .populate("parent_id")
      .populate("doctor_id")
      .populate("appointment_id")
      .populate("to");
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a notification by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("child_id")
      .populate("parent_id")
      .populate("doctor_id")
      .populate("appointment_id")
      .populate("to");
    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a notification by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
