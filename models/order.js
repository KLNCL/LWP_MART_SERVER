const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({


    // user id means loging account id
    user_id :{           
        type : String,
        required: true
    },


    product_id :{
        type : String,
        required: true
    },

    // seller id means product_iD's user id
    seller_id :{           
        type : String,
        required: true
    },

    buyerName :{
        type : String,
        required: true
    },

    address :{
        type: String,
        required: true
    },

    orderqty :{
        type: String,
        required: true
    },
    contact :{
        type: String,
        required: true
    },
    image: { 
        type: String }
})

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;