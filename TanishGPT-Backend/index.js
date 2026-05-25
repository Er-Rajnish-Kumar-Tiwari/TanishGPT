require('dotenv').config();

const express = require("express");
const cors = require("cors");

const dbConnection = require("./Config/db");
const userRouter = require("./Routes/UserRoutes");
const chatRouter = require('./Routes/ChatRoutes');
const messageRouter = require('./Routes/MessageRoute');
const transactionRoutes = require('./Routes/TransactionRoutes');

const app = express();

// Database connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/transaction", transactionRoutes);

// Server
const PORT = process.env.PORT || 2000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);