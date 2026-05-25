const Transaction = require("../Models/Transaction");
const User = require("../Models/User");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];


// ============================
// GET ALL PLANS
// ============================
const getPlans = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================
// RAZORPAY INSTANCE
// ============================
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_ID,
  key_secret: process.env.RAZOR_PASS,
});


// ============================
// CREATE ORDER
// ============================
const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find((p) => p._id === planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Create Transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    // Razorpay Order
    const options = {
      amount: plan.price * 100,
      currency: "INR",
      receipt: transaction._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ============================
// VERIFY PAYMENT
// ============================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Create Signature
    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PASS)
      .update(body.toString())
      .digest("hex");

    // Verify Signature
    const isAuthentic =
      expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    // Fetch Order
    const orderInfo = await razorpayInstance.orders.fetch(
      razorpay_order_id
    );

    // Find Transaction
    const transaction = await Transaction.findById(
      orderInfo.receipt
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Already Paid
    if (transaction.isPaid) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // Update Transaction
    transaction.isPaid = true;
    transaction.paymentId = razorpay_payment_id;

    await transaction.save();

    // Add Credits to User
    await User.findByIdAndUpdate(transaction.userId, {
      $inc: {
        credits: transaction.credits,
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// ============================
// EXPORTS
// ============================
module.exports = {
  getPlans,
  paymentRazorpay,
  verifyPayment,
};