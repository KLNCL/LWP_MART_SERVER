const { response } = require('express');
const User = require('../models/user');
const { errorHandler } = require('../utils/error')

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

// find user by ID
const findUser = async (req, res, next) => {
    const {userID} = req.params.userID;
    try {
        const user = await User.findOne({userID});
        if(!user){
            return next(errorHandler(404, "User Not Found !"))
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
    const {userName, password } = req.body;

    try {

        const updateUser = await User.findByIdAndUpdate(user, {
            $set: {
                userName: userName,
                password: password
            }
        },{new: true})

        return res.status(200).json({message:"User Updated"})
        
    } catch (error) {
        next(error);
    }
}

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