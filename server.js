const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./Routes/Router')
const http = require("http");
const { Server } = require("socket.io");


dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());

app.use(express.json()); // Parse JSON bodies

app.use(
    express.urlencoded({
         extended: true,
     })
 );
 

 // Routes
app.use('/api', userRouter);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

db.once("open", () => {
    console.log("MongoDB Connected");
})

//error handle
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// WebSocket setup for real-time messaging
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000", // Adjust based on your frontend URL
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("sendMessage", async ({ sender, receiver, message }) => {
      try {
        const Message = require("./models/Message");
        const newMessage = new Message({ sender_id: sender, receiver_id: receiver, message });
        await newMessage.save();
  
        io.to(receiver).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
