const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    address: {
        type: String,
    },
    description: {
        type: String
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
        default: true
    },
    password: { 
        type: String,
        required: true
    },

    chattedWith: [Schema.Types.ObjectId] // Array to store user IDs of chatted users
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;