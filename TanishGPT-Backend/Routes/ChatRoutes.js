const express = require('express');
const { createChat, getChats, deleteChat } = require('../Controlls/ChatController');
const tanishGPTAuth = require('../Middlewares/Auth');

const chatRouter = express.Router();

chatRouter.post('/create', tanishGPTAuth, createChat);
chatRouter.get('/get', tanishGPTAuth, getChats);
chatRouter.post('/delete', tanishGPTAuth, deleteChat);

module.exports = chatRouter;