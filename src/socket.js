const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

module.exports = io;
