// socket-server.js - Standalone Socket.io server for Next.js
const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Store connected users by userId
  const connectedUsers = new Map()

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // User joins their personal room
    socket.on('user:join', (userId) => {
      socket.userId = userId
      socket.join(`user:${userId}`)
      connectedUsers.set(userId, socket.id)
      console.log(`User ${userId} joined their room`)
    })

    // Listen for avatar updates
    socket.on('avatar:update', (data) => {
      const { userId, imageUrl } = data
      console.log(`Avatar updated for user ${userId}:`, imageUrl)
      // Broadcast to all sockets for this user (multiple tabs)
      io.to(`user:${userId}`).emit('avatar:updated', { userId, imageUrl })
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId)
        console.log(`User ${socket.userId} disconnected`)
      }
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.io server running`)
    })
})
