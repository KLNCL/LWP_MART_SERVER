const Message = require('../models/Message');
const User = require('../models/user');

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

    // Update chattedWith field for both sender and receiver
    await User.findByIdAndUpdate(sender_id, {
      $addToSet: { chattedWith: receiver_id }
    });

    await User.findByIdAndUpdate(receiver_id, {
      $addToSet: { chattedWith: sender_id }
    });

    // Emit WebSocket event for new message
    const io = req.app.get('socketio');
    if (io) {
      io.emit("newMessage", {
        sender_id,
        receiver_id,
      });
    } else {
      console.error("Socket.io instance not available");
    }

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
    const messages = await Message.find({}).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages by sender ID
exports.getAllMessagesById = async (req, res) => {
  try {
    const { sender } = req.params;

    // Fetch messages and populate sender and receiver details
    const messages = await Message.find({
      $or: [{ sender_id: sender }, { receiver_id: sender }],
    })
      .populate('sender_id', 'userName') // Populate sender details
      .populate('receiver_id', 'userName') // Populate receiver details
      .sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search users by username and return user ID
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // Search for users whose username matches the query (case insensitive)
    const users = await User.find(
      { userName: { $regex: query, $options: 'i' } },
      { _id: 1, userName: 1 } // Only return _id and userName
    );

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get chatted users
exports.getChattedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch messages where the current user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
    })
      .populate('sender_id', 'userName') // Populate sender details
      .populate('receiver_id', 'userName'); // Populate receiver details

    // Extract unique users
    const users = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.sender_id._id === userId ? msg.receiver_id : msg.sender_id;
      if (!users.has(otherUser._id)) {
        users.set(otherUser._id, {
          _id: otherUser._id,
          userName: otherUser.userName,
        });
      }
    });

    res.status(200).json(Array.from(users.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};