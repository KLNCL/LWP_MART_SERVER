const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    userName :{
        type : String,
        required: true
    },

    firstName :{
        type : String
    },
    lastName :{
        type : String
        
    },
    email :{
        type: String,
        required: true
        
    },
    contactNo :{
        type: String
        
    },
    role :{
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user",

    },
    image: { type: String }
    ,
    activation: { 
        type: Boolean
    
    },
    password: { 
        type: String,
        required: true
    },
})

const User = mongoose.model("User",userSchema);

module.exports = User;