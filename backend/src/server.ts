import express,{ Request, Response} from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.routes';
import chatSocket from './sockets/chat.socket';
import dotenv from 'dotenv';
dotenv.config();
import setupChatSocket from './sockets/chat.socket';

// Create server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', // Your frontend url here (Astro, React, vanilla HTML)
    methods: ["GET", "POST"]
  },
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to server')
})

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!
mongoose
  .connect(MONGO_URI, { dbName: 'chatroom' })
  .then(() => {
    console.log('Connected to MongoDB database');

    // Start Socket.IO
    chatSocket(io);

    setupChatSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  // Socket.io

const users:Record<string,string> = {}


io.on('connection', (socket) => {
  // On connect
  console.log(`A new user has appeared...`)

    // Listen for new messages and send to all clients
  socket.on('chat', (data) => {
    console.log(`${data.username} has sent "${data.message}"`)
    users[socket.id] = data.username
    io.emit('chat', data) // Sent to all connected clients


  })

   // Disconnect
   socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`)
    io.emit('chat',{ username: 'System', message: `${socket.id} has left`})
  })
})