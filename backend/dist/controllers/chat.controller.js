"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
// Get all chats
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chat_model_1.Chat.find().sort({ createdAt: 1 }); // Sort by createdAt field
        res.status(200).json(chats);
        console.log('Past message', chats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching chats' });
    }
});
// Get student by id
const getChatById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chat_model_1.Chat.findById(req.params.id);
        res.status(200).json(chat);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to get student by id' });
    }
});
const addChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, message, room } = req.body;
        const newChat = yield chat_model_1.Chat.create(req.body);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to add student' });
    }
});
exports.default = {
    getAllChats,
    getChatById,
    addChat,
};
