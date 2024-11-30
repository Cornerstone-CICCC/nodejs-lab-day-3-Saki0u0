"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Create server
const app = (0, express_1.default)();
const ioServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(ioServer, {
    cors: {
        origin: "http://localhost:4321",
        methods: ["GET", "POST"]
    }
});
//Socket.io
io.on('connection', (socket) => {
    console.log(`A new user join - id: ${socket.id}`);
    // When client disconnects from server
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected`);
    });
    // Listen to messages and send to everyone
    socket.on("message", (data) => {
        io.emit(`message`, data);
    });
    // Joining a room
    socket.on('join room', (data) => {
        socket.join(data.room);
        console.log(`${data.username} joined the room ${data.room}`);
        io.to(data.room).emit('message', {
            text: `${data.username} joined the room ${data.room}`,
            username: 'System',
            room: data.room
        });
    });
    // Leaving a room
    socket.on('leave room', (data) => {
        socket.leave(data.room);
        console.log(`${data.username} has left the room ${data.room}`);
        io.to(data.room).emit('message', {
            text: `${data.username} has left the room ${data.room}`,
            username: 'System',
            room: data.room
        });
    });
});
// Start server
const PORT = process.env.PORT || 3000;
ioServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
