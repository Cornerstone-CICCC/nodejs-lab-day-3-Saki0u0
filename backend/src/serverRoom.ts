import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()

//Create server
const app = express()
const ioServer = createServer(app)
const io = new Server(ioServer, {
  cors: {
    origin:"http://localhost:4321",
    methods:["GET","POST"]
  }
})

//Socket.io
io.on('connection', (socket) => {
  console.log(`A new user join - id: ${socket.id}`)

  // When client disconnects from server
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`)
  })

  // Listen to messages and send to everyone
  socket.on("message", (data) => {
    io.emit(`message`, data)
  })

  // Joining a room
socket.on('join room', (data) => {
  socket.join(data.room)
  console.log(`${data.username} joined the room ${data.room}`)
  io.to(data.room).emit('message', {
    text: `${data.username} joined the room ${data.room}`,
    username: 'System',
    room: data.room 
  })
})

// Leaving a room
socket.on('leave room', (data) => {
  socket.leave(data.room)
  console.log(`${data.username} has left the room ${data.room}`)
  io.to(data.room).emit('message', {
    text: `${data.username} has left the room ${data.room}`,
    username: 'System',
    room: data.room
  })
})
})


// Start server
const PORT = process.env.PORT || 3000
ioServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})