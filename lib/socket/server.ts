// lib/socket/server.ts - Socket.io server setup
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

let io: SocketIOServer | null = null

export const initSocket = (httpServer: HTTPServer) => {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // User joins their personal room
      socket.on('user:join', (userId: string) => {
        socket.data.userId = userId
        socket.join(`user:${userId}`)
        console.log(`User ${userId} joined their room`)
      })

      // Listen for avatar updates
      socket.on('avatar:update', (data: { userId: string; imageUrl: string }) => {
        const { userId, imageUrl } = data
        console.log(`Avatar updated for user ${userId}:`, imageUrl)
        // Broadcast to all sockets for this user (multiple tabs)
        io?.to(`user:${userId}`).emit('avatar:updated', { userId, imageUrl })
      })

      socket.on('disconnect', () => {
        if (socket.data.userId) {
          console.log(`User ${socket.data.userId} disconnected`)
        }
      })
    })
  }
  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

export const emitAvatarUpdate = (userId: string, imageUrl: string) => {
  const io = getIO()
  io.to(`user:${userId}`).emit('avatar:updated', { userId, imageUrl })
}
