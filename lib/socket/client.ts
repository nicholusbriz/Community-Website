// lib/socket/client.ts - Socket.io client setup
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (userId: string) => {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
    socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id)
      socket?.emit('user:join', userId)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
  }
  return socket
}

export const getSocket = () => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
