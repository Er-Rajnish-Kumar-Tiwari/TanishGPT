const Chat = require("../Models/Chat");
const User = require("../Models/User");
const client = require("../Config/openai");
const imagekit = require("../Config/imagekit");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

const textMessageController = async (req, res) => {

    try {

        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        // Validation
        if (!chatId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and prompt are required"
            });
        }

        // Find User
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Credits Check
        if (user.credits < 1) {
            return res.status(403).json({
                success: false,
                message: "No credits left"
            });
        }

        // Find Chat
        const chat = await Chat.findOne({
            _id: chatId,
            userId
        });

        // Chat Not Found
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // User Message Object
        const userMessage = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: true
        };

        // Save User Message
        chat.messages.push(userMessage);

        // First Chat Rename
        if (chat.name === "New Chat") {
            chat.name = prompt.substring(0, 25);
        }

        // Save User Message Immediately
        await chat.save();

        // AI Response
        const completion = await client.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: chat.messages
                .filter(msg => msg.content)
                .map((msg) => ({
                    role: msg.role,
                    content: msg.content
                }))
        });

        const aiContent = completion?.choices?.[0]?.message?.content;

        if (!aiContent) {
            return res.status(500).json({
                success: false,
                message: "AI response failed"
            });
        }

        // AI Reply Object
        const reply = {
            role: "assistant",
            content: aiContent,
            timestamp: Date.now(),
            isImage: false,
            isPublished: true
        };

        // Save AI Reply
        chat.messages.push(reply);

        // Save Chat Again
        await chat.save();

        // Deduct Credits
        user.credits -= 1;
        await user.save();

        // Final Response
        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            reply
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt, isPublished } = req.body;

        // 1. Validation
        if (!chatId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and prompt are required"
            });
        }

        // 2. Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 3. Credit Check
        if (user.credits < 2) {
            return res.status(403).json({
                success: false,
                message: "No credits left"
            });
        }

        // 4. Find Chat
        const chat = await Chat.findOne({
            _id: chatId,
            userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // 5. Save User Message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: true,
            isPublished: isPublished || false
        });

        // ==========================================
        // ALTERNATE IMAGE GENERATION (POLLINATIONS AI)
        // ==========================================
        // Pollinations AI highly optimized Flux model use karta hai jo bilkul free hai.
        const encodedPrompt = encodeURIComponent(prompt);
        const pollinationsUrl = `https://image.pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=42&nologo=true`;

        console.log("Generating image via Pollinations AI...");

        const response = await axios.get(pollinationsUrl, {
            responseType: "arraybuffer",
            timeout: 90000 // 40 seconds timeout
        });

        // Convert arraybuffer to Base64 safely
        const imageBase64 = Buffer.from(response.data).toString("base64");

        if (!imageBase64) {
            return res.status(500).json({
                success: false,
                message: "Image generation failed or returned empty data"
            });
        }

        // =========================
        // UPLOAD TO IMAGEKIT
        // =========================
        const uploadResponse = await imagekit.upload({
            file: Buffer.from(imageBase64, "base64"),
            fileName: `ai-image-${Date.now()}.png`,
            folder: "/ai-images",
        });

        // =========================
        // SAVE ASSISTANT MESSAGE & DEDUCT CREDITS
        // =========================
        chat.messages.push({
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished: isPublished || false
        });

        await chat.save();

        // Deduct Credits
        user.credits -= 2;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Image generated successfully",
            imageUrl: uploadResponse.url
        });

    } catch (error) {
        console.log("IMAGE ERROR DETECTED:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error during generation"
        });
    }
};

const getPublishedImages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;

        // 1. Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 2. Find Chat
        const chat = await Chat.findOne({
            _id: chatId,
            userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        // 3. Get Published Images
        const publishedImages = chat.messages.filter(message => message.isImage && message.isPublished);

        return res.status(200).json({
            success: true,
            message: "Published images retrieved successfully",
            publishedImages
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

module.exports = { textMessageController, imageMessageController, getPublishedImages };