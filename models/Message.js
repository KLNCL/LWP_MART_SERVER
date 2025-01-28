const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the sender
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID of the recipient
  message: { type: String, required: true }, // The actual message
  timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
});

module.exports = mongoose.model('Message', messageSchema);