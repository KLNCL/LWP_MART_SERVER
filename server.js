const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./Routes/Router')

dotenv.config();

const app = express();

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


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
