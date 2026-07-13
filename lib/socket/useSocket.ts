// lib/socket/useSocket.ts - React hook for Socket.io
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/app/lib/auth/useAuth'
import { initSocket, getSocket, disconnectSocket } from './client'

interface AvatarUpdateEvent {
  userId: string
  imageUrl: string | null
}

export function useSocket() {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [avatarUpdate, setAvatarUpdate] = useState<AvatarUpdateEvent | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const socket = initSocket(user.id)

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    // Listen for avatar updates
    socket.on('avatar:updated', (data: AvatarUpdateEvent) => {
      console.log('Avatar update received:', data)
      setAvatarUpdate(data)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('avatar:updated')
    }
  }, [user?.id])

  const emitAvatarUpdate = useCallback((imageUrl: string) => {
    const socket = getSocket()
    if (socket && user?.id) {
      socket.emit('avatar:update', { userId: user.id, imageUrl })
    }
  }, [user?.id])

  return {
    isConnected,
    avatarUpdate,
    emitAvatarUpdate,
  }
}
