const { response } = require('express');
const cart = require('../models/cart');
const Product = require("../models/product");
const { errorHandler } = require('../utils/error');
const mongoose = require('mongoose');


// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, user_id, cartqty } = req.body;

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cartItem = await cart.findOne({ product_id, user_id });

        if (cartItem) {
            cartItem.cartqty = parseInt(cartItem.cartqty) + parseInt(cartqty);
        } else {
            cartItem = new cart({
                product_id,
                user_id,
                productName2: product.productName,
                price: product.price,
                image2: product.image,
                cartqty
            });
        }

        await cartItem.save();
        res.status(200).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cartItem = await cart.findByIdAndDelete(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update cart quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { cartqty } = req.body;

        const cartItem = await cart.findById(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.cartqty = cartqty;
        await cartItem.save();

        res.status(200).json({ message: "Cart quantity updated", cartItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all cart items for a user with product details
const getUserCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const cartItems = await cart.find({ user_id }).populate("product_id");
        
        if (cartItems.length == 0) {
            return res.status(200).json({ message: "Cart is empty", cartItems });
        }

        const cartDetails = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findById(item.product_id);
                return {
                    _id: item._id,
                    seller_id: product.user_id,
                    product_id: item.product_id,
                    productName2: product.productName,
                    image2: product.image,
                    price: product.price,
                    cartqty: item.cartqty
                };
            })
        );

        res.status(200).json(cartDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.updateCartQuantity = updateCartQuantity;
exports.getUserCart = getUserCart;
