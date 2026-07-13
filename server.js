// server.js - Custom server with Socket.io integration
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.io
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

  // Make io globally accessible for API routes
  global.io = io

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
