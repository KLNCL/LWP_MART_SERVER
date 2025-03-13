const { response } = require("express");
const orders = require("../models/order");
const { errorHandler } = require("../utils/error");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

// get all orders
const getOrders = async (req, res, next) => {
  try {
    const allorders = await orders.find();
    if (!allorders) {
      return next(errorHandler(404, "order Not Available"));
    }
    return res.status(200).json(allorders);
  } catch (error) {
    next(error);
  }
};

//get orders by user id
const findOrderUid = async (req, res, next) => {
  const user_id = req.body.user_id;

  try {
    const order = await Order.find({ user_id });

    if (!order || order.length === 0) {
      return next(errorHandler(404, "Order not found!"));
    }
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get order by seller_id
const findOrderSid = async (req, res, next) => {
  const seller_id = req.params.seller_id;

  if (!mongoose.Types.ObjectId.isValid(seller_id)) {
    return next(errorHandler(400, "Invalid seller ID!"));
  }

  try {
    const order = await Order.find({ seller_id });

    if (!order || order.length === 0) {
      return next(errorHandler(404, "Order not found!"));
    }
    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// create order
const addOrder = async (req, res, next) => {

  const {
    user_id,
    seller_id,
    product_id,
    buyerName,
    address,
    orderqty,
    contact,
  } = req.body;

  const product = await Product.findById(product_id);
  if (!product) {
      return res.status(404).json({ message: "Product not found" });
  }

  const newOrder = new Order({
    user_id,
    product_id,
    seller_id, // seller id means product_iD's user id
    buyerName,
    address,
    orderqty,
    contact,
    image: product.image,
  });

  try {
    if (!Order) {
      return next(errorHandler(404, "Please Insert Order"));
    }
    await newOrder.save();
    return res.status(200).json({ message: "Order added successfuly" });
  } catch (error) {
    next(error);
  }
};

// update order
const updateOrder = async (req, res, next) => {
  const order = req.params.orderID;
  const { buyerName, address, contact } = req.body;

  try {
    const updateOrder = await Order.findByIdAndUpdate(
      order,
      {
        $set: {
          buyerName: buyerName,
          address: address,
          contact: contact,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Order Updated !" });
  } catch (error) {
    next(error);
  }
};

//delete orders
const deleteOrder = async (req, res, next) => {
  const OID = req.params.orderID;

  try {
    const result = await orders.deleteMany({ _id: OID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = getOrders;
exports.addOrder = addOrder;
exports.findOrderSid = findOrderSid;
exports.findOrderUid = findOrderUid;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
