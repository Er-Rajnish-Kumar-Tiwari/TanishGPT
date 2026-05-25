const express = require("express");
const messageRouter = express.Router();
const { textMessageController, imageMessageController, getPublishedImages } = require("../Controlls/MessageController");
const tanishGPTAuth = require('../Middlewares/Auth');

messageRouter.post("/text", tanishGPTAuth, textMessageController);
messageRouter.post("/image", tanishGPTAuth, imageMessageController);
messageRouter.get("/published-images", tanishGPTAuth, getPublishedImages);

module.exports = messageRouter;