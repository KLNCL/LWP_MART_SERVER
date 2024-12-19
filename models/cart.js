const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({

    product_id :{
        type : String,
        required: true
    },

    user_id :{
        type : String,
        required: true
    },

    price :{
        type : String,
        required: true
    },
    cartqty :{
        type: String,
        required: true
    }
})

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;