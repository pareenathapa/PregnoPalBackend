const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const protect = (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin check
const isAdmin = (req, res, next) => {
  // You can check the user's role in the database or add a role property in the JWT payload
  // For simplicity, let's assume we have a role field in the user model
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied, admin privileges required" });
  }
  next();
};

module.exports = { generateToken, protect, isAdmin };
