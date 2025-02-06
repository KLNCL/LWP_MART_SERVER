const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures no duplicate emails
        trim: true
    },
    contactNo: {
        type: String,
        match: /^[0-9]+$/, // Ensures only numbers are entered
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    },
    image: { 
        type: String 
    },
    activation: { 
        type: Boolean,
        default: false
    },
    password: { 
        type: String,
        required: true
    }
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const User = mongoose.model("User", userSchema);

module.exports = User;
