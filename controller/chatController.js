const Message = require('../models/Message');
const User = require('../models/user');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    // Validate input
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ error: 'Sender ID, Receiver ID, and Message are required' });
    }

    // Save the message to the database
    const newMessage = new Message({ sender_id, receiver_id, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;

    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender_id: sender, receiver_id: receiver },
        { sender_id: receiver, receiver_id: sender },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages between all users
exports.getAllMessages = async (req, res) => {
  try {
    // Fetch messages between the two users
    const messages = await Message.find({
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reciver id by sender id
exports.getAllMessagesById = async (req, res) => {
  try {
    const { sender } = req.params;
    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender_id: sender }
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};




// Search users by username
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // Search for users whose username matches the query
    const users = await User.find({ username: { $regex: query, $options: 'i' } });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};