const { response } = require('express');
const User = require('../models/user');
const { errorHandler } = require('../utils/error');
const {createTokens} = require ('../utils/genarateToken');

const signin  = async (req, res, next) => {

    const {email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        return next (errorHandler(400, "All field are required"));
    }

    try {
        const validUser = await User.findOne({email});
        if (!validUser){
            return next (errorHandler(403, "Email or Password is Invalid !"));
        }
        if(validUser.password != password){
            return next (errorHandler(403, "Email or Password is Invalid !"));
        }
        const token = await createTokens(validUser);
        return res
        .status(200).json(token);
    } catch (error) {
        next(error);
    }

};

exports.signin = signin;
    
