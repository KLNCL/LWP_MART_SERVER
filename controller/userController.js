const { response } = require('express');
const User = require('../models/user');
const { errorHandler } = require('../utils/error')
const mongoose = require('mongoose');

// find all users
const getUsers = async(req, res, next) => {

    try {
        const allUsers = await User.find();
        if(!allUsers){
            return next(errorHandler(404, "Users Not Available !"))
        }
        return res.status(200).json(allUsers);   
    } catch (error) {
        next(error);
    }
    
};

// find chat users
exports.findChatedUser = async (req, res, next) => {
    const { userID } = req.params; // Correctly destructure userID from req.params
    try {
      const user = await User.findById(userID)
        .populate('chattedWith', 'userName'); // Populate the chattedWith field with user names
      if (!user) {
        return next(errorHandler(404, "User Not Found !"));
      }
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

// find user by ID
const findUser = async (req, res, next) => {
    const userID = req.params.userID;
    
    // Validate if userID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userID)) {
        return next(errorHandler(400, "Invalid User ID"));
    }

    try {
        const user = await User.findOne({ _id: userID });
        
        if (!user) {
            return next(errorHandler(404, "User Not Found!"));
        }

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


// Create user
const addUser = async (req, res, next) => {
    const { userName, email, password } = req.body;

    const newUser = new User({
        userName,
        email,
        password,
    });
    
    try {

        if (await User.findOne({ email })) {
            return next(errorHandler(400, "Email already exists"));
        }

        if (await User.findOne({ userName })) {
            return next(errorHandler(400, "User Name already exists"));
        }

        await newUser.save();
        return res.status(200).json({ message: "Signup successful" });
    } catch (error) {
        next(error);
    }
};

//update user
const updateUser = async (req, res, next) =>{
    const user = req.params.userID;
    const { fullName, address, description, contactNo, role, image } = req.body;

    try {

        const updateUser = await User.findByIdAndUpdate(user, {
            $set: {
              fullName: fullName,
              address: address,
              description: description, // Fixed spelling
              contactNo: contactNo,
              role: role,
              image: image
            }
          }, { new: true });
          
        return res.status(200).json({message:"User Updated"})
        
    } catch (error) {
        next(error);
    }
}

const userActivation = async (req, res, next) => {
    const UID = req.params.userID;

    try {
        const userActivation = await User.findByIdAndUpdate(UID, {
            $set: {
                activation: true,
            }
          }, { new: true });

          return res.status(200).json({message:"User Activate succesfull"})

        
    } catch (error) {
        next(error);
    }

};

const userDeactivation = async (req, res, next) => {
    const UID = req.params.userID;
    try {
        const userDeactivation = await User.findByIdAndUpdate(UID, {
            $set: {
                activation: false,
            }
          }, { new: true });

          return res.status(200).json({message:"User Deactivate succesfull"})

        
    } catch (error) {
        next(error);
    }

};



//delete user
const deleteUser = async (req, res, next) => {
    const UID = req.params.userID;

    try {
        const result = await User.deleteOne({ _id: UID });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User Deleted Successfully" });
    } catch (error) {
        next(error);
    }
};



exports.getUsers = getUsers;
exports.findUser = findUser;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.userActivation = userActivation;
exports.userDeactivation = userDeactivation;