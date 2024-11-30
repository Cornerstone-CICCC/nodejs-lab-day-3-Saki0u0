import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection',async (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    try {
      console.log('Fetching past messages...');
      const pastMessages = await Chat.find().sort({ createdAt: 1 });
      console.log('Past messages:', pastMessages);
      socket.emit('messages', pastMessages);
    } catch (error) {
      console.error('Error retrieving past messages:', error);
    }

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { username, message } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message });
        await chat.save();

        console.log('Saved chat:', chat); 

        // Broadcast the chat object to all connected clients via the newMessage event
        io.emit('newMessage', chat);
        
        // For room-based broadcast
        // io.to(data.room).emit('newMessage', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

function joinRoom(socket: Socket, roomName: string) {
  socket.join(roomName);
  socket.emit('joinedRoom', { roomName });
  socket.to(roomName).emit('message', { username: socket.id, message: `${socket.id} has joined the room.` });
}

function leaveRoom(socket: Socket, roomName: string) {
  socket.leave(roomName);
  socket.emit('leftRoom', { username: socket.id });
  socket.to(roomName).emit('message', { username: socket.id, message: `${socket.id} has left the room.` });
}

function sendMessageToRoom(socket: Socket, roomName: string, message: string) {
  socket.to(roomName).emit('message', { username: socket.id, message });
}


function getMessagesByRoom(socket: Socket, roomName: string) {
 
  const messages = [];
  socket.emit('message', { messages });
}


export default setupChatSocket

;