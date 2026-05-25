const express = require('express');
const transactionRoutes = express.Router();

const {
  getPlans,
  paymentRazorpay,
  verifyPayment,
} = require('../Controlls/CreditsController');

const tanishGPTAuth = require("../Middlewares/Auth")

transactionRoutes.post('/create', tanishGPTAuth, paymentRazorpay);
transactionRoutes.get('/get', getPlans);
transactionRoutes.post("/verify", tanishGPTAuth, verifyPayment);

module.exports = transactionRoutes;