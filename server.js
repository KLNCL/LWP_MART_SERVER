const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./Routes/Router");
const http = require("http");
const { Server } = require("socket.io");
const { GridFSBucket } = require("mongodb");
dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins for WebSockets
});

// Attach socketio to app
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;

// Initialize GridFS
let gfs;
db.once("open", () => {
  console.log("MongoDB Connected");
  gfs = new GridFSBucket(db.db, {
    bucketName: "uploads", // Name of the GridFS bucket
  });
});

// Serve images from GridFS
app.get("/api/image/:id", (req, res) => {
  if (!gfs) {
    return res.status(500).json({ message: "GridFS not initialized" });
  }

  const fileId = new mongoose.Types.ObjectId(req.params.id);
  const downloadStream = gfs.openDownloadStream(fileId);

  downloadStream.on("error", (error) => {
    res.status(404).json({ message: "Image not found" });
  });

  downloadStream.pipe(res);
});

// WebSocket Events
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for new messages
  socket.on("sendMessage", (data) => {
    // Broadcast the message to all clients
    io.emit("receiveMessage", data);

    // Notify clients about the new message to refresh chatted users list
    io.emit("newMessage", {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
    });
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Global Error Handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));