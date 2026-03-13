const express = require("express");
const bookingRouter = express.Router();
const { protectRoute } = require("../controller/UserController");
const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");
const bookingModel = require("../model/bookingModel");
const UserModel = require("../model/userModal");

const instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});

bookingRouter.use(express.json());

bookingRouter.post("/:productId", protectRoute, async (req, res) => {
  try {
    const prodId = req.params.productId;
    const userId = req.userId;
    const priceAtBooking = Number(req.body.priceAtBooking);

    const booking = await bookingModel.create({
      priceAtBooking,
      user: userId,
      product: prodId
    });

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { booking: booking._id } },
      { new: true }
    );

    const razorpayOrder = await instance.orders.create({
      amount: priceAtBooking,
      currency: "INR",
      receipt: booking._id.toString()
    });

    booking.paymentOrderId = razorpayOrder.id;
    await booking.save();

    res.status(200).json({
      message: "Order placed",
      data: booking,
      razorpayOrder
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

bookingRouter.post("/verification", async (req, res) => {
  try {
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const freshSignature = shasum.digest("hex");

    if (freshSignature !== req.headers["x-razorpay-signature"]) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const booking = await bookingModel.findOne({
      paymentOrderId: req.body.payload.payment.entity.order_id
    });

    if (booking) {
      booking.status = "confirmed";
      booking.paymentOrderId = undefined;
      await booking.save();
    }

    res.json({ status: "ok" });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

bookingRouter.get("/", protectRoute, async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .populate({ path: "user", select: "name role email" })
      .populate({ path: "product", select: "name categories brand" });

    res.status(200).json({
      message: bookings
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

module.exports = bookingRouter;