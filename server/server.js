import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', socket => {
  console.log(`connected to client`)

  socket.on('get-document', documentId => {
    const data = ''
    socket.join(documentId)
    socket.emit('load-document', data)

    socket.on('send-changes', delta => {
      console.log(`delta is ${JSON.stringify(delta)}`)

      socket.broadcast.to(documentId).emit('receive-changes', delta)
    })
  })
})
