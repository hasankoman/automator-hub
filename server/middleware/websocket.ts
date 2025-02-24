import { defineEventHandler } from 'h3'
import { Server } from 'socket.io'

let io: Server

export default defineEventHandler((event) => {
  if (!io) {
    // @ts-ignore
    io = new Server(event.node.res.socket?.server, {
      path: '/ws',
      cors: {
        origin: '*',
      },
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('subscribe', (channel) => {
        socket.join(channel)
        console.log(`Client ${socket.id} subscribed to ${channel}`)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  // @ts-ignore
  event.context.io = io
}) 