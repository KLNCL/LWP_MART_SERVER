const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({

    user_id :{
        type : String,
        required: true
    },
    productName :{
        type : String,
        required: true
    },
    discription :{
        type: String,
        required: true
    },
    price :{
        type: String,
        required: true
    },
    qty :{
        type: String,
        // required: true
    },
    image: { type: String }

})

const Product = mongoose.model("Product",productSchema);

module.exports = Product;