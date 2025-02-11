const { response } = require('express');
const Product = require('../models/product');
const { errorHandler } = require('../utils/error');
const mongoose = require('mongoose');


// find all products

const getProducts = async (req, res, next) => {
    try {
        const allProduct = await Product.find();
        if (!allProduct){
            return next (errorHandler(404, "Produts Not Available"))
        }
        return res.status(200).json(allProduct);
        
    } catch (error) {
        next(error);
    }
};


// find product by product id
const findProduct = async (req, res, next) => {
    const _id = req.params.productID;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return next(errorHandler(400, "Invalid product ID!"));
    }

    try {
        const foundProduct = await Product.findOne({_id});

        if (!foundProduct) {
            return next(errorHandler(404, "Product not found!"));
        }
        return res.status(200).json(foundProduct);

    } catch (error) {
        next(error);
    }
};

// Find products by user_id
const findProductUid = async (req, res, next) => {
    const user_id = req.body.user_id;

    try {
        const products = await Product.find({ user_id });


        if (!products || products.length === 0) {
            return next(errorHandler(404, "Products not found!"));
        }
        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// Create product
const addProduct = async (req, res, next) => {
    const { user_id, productName, discription, price, qty, image } = req.body;

    const newProduct = new Product({
        user_id,
        productName,
        discription,
        price,
        qty,
        image,
    });

    try {
    
        if (!newProduct) {
            return next(errorHandler(404, "Please Insert Product"));
        }

        await newProduct.save();
        return res.status(200).json({ message: "Product added successfully" });

    } catch (error) {
        next(error);
    }
};



//update product
const updateProdut = async (req, res, next) =>{
    const product = req.params.productID;
    const {productName, discription, price, qty, image} = req.body;

    try {

        const updateProdut = await Product.findByIdAndUpdate(product, {
            $set: {
                productName: productName,
                discription: discription,
                price: price,
                qty: qty,
                image: image,
            }
        },{new: true})

        return res.status(200).json({message:"Product Updated !"})
        
    } catch (error) {
        next(error);
    }
};

//delete product
const deleteProduct = async (req, res, next) => {
    const PID = req.params.productID;

    try {
        const result = await Product.deleteOne({ _id: PID });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (error) {
        next(error);
    }
};


exports.getProducts = getProducts;
exports.findProduct = findProduct;
exports.findProductUid = findProductUid;
exports.addProduct = addProduct;
exports.updateProdut = updateProdut;
exports.deleteProduct = deleteProduct;