// types/global.d.ts - Global type declarations
import { Server } from 'socket.io'

declare global {
  var io: Server | undefined
}

export {}
