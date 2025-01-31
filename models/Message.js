const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender_id: { // The ID of the user sending the message
        type: String,
        required: true
    },

    receiver_id: { // The ID of the user receiving the message
        type: String,
        required: true
    },

    message: { // The actual text message
        type: String,
        required: true
    },

    timestamp: { // Time when the message was sent
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
