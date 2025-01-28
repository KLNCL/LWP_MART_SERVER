const Message = require('../models/Message');

// Save a new message
const saveMessage = async (data) => {
  try {
    const newMessage = new Message(data);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw new Error('Error saving message: ' + error.message);
  }
};

// Fetch chat history between two users
const getMessages = async (req, res) => {
  const { senderId, recipientId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId, recipientId }, // Messages sent by the user to the recipient
        { senderId: recipientId, recipientId: senderId }, // Messages sent by the recipient to the user
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.saveMessage = saveMessage ;
exports.getMessages = getMessages;
