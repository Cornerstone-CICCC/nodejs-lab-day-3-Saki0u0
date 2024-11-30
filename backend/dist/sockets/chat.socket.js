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
const setupChatSocket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // On connect
        console.log(`User connected: ${socket.id}`);
        try {
            console.log('Fetching past messages...');
            const pastMessages = yield chat_model_1.Chat.find().sort({ createdAt: 1 });
            console.log('Past messages:', pastMessages);
            socket.emit('messages', pastMessages);
        }
        catch (error) {
            console.error('Error retrieving past messages:', error);
        }
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message });
                yield chat.save();
                console.log('Saved chat:', chat);
                // Broadcast the chat object to all connected clients via the newMessage event
                io.emit('newMessage', chat);
                // For room-based broadcast
                // io.to(data.room).emit('newMessage', chat)
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        // On disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    }));
};
function joinRoom(socket, roomName) {
    socket.join(roomName);
    socket.emit('joinedRoom', { roomName });
    socket.to(roomName).emit('message', { username: socket.id, message: `${socket.id} has joined the room.` });
}
function leaveRoom(socket, roomName) {
    socket.leave(roomName);
    socket.emit('leftRoom', { username: socket.id });
    socket.to(roomName).emit('message', { username: socket.id, message: `${socket.id} has left the room.` });
}
function sendMessageToRoom(socket, roomName, message) {
    socket.to(roomName).emit('message', { username: socket.id, message });
}
function getMessagesByRoom(socket, roomName) {
    const messages = [];
    socket.emit('message', { messages });
}
exports.default = setupChatSocket;
