const express = require('express');
const userRouter = express.Router();
const { registerUser, loginUser, getUserData } = require('../Controlls/UserController');
const tanishGPTAuth = require('../Middlewares/Auth');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', tanishGPTAuth, getUserData);

module.exports = userRouter;