const Chat = require("../Models/Chat");
const createChat = async (req, res) => {
    try {

        const userId = req.user._id;
        const chatData = {
            userId,
            messages: [],
            userName : req.user.name,
            name : "New Chat" 
        }

        const chat = await Chat.create(chatData);
        res.status(201).json({
            message: "Chat created successfully",
            chat,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json({
            message: "Chats retrieved successfully",
            chats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        const userId = req.user._id;

        const chat = await Chat.deleteOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        res.status(200).json({
            message: "Chat deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { createChat, getChats ,deleteChat };