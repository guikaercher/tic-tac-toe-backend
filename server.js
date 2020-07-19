const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000

let lastRoomNumber = 0

const roomsAvailable = [
  'room0'
]

server.listen(port, () => {
  console.log(`listening at: ${port}`);
})

app.get('/', (req, res) => {
  res.send('Working!');
});

io.on('connection', (socket) => {

  socket.on('player-register', (data) => {
    const { player } = data
    const room = roomsAvailable[0]
    console.log(room)
    socket.emit('redirect-to-game', { player, room });
});

    socket.on('join-room', (data) => {
      const { player, room } = data
      socket.join(room);
      const roomDetails = io.sockets.adapter.rooms[room];
      console.log('room length')
      console.log(roomDetails.length)
      if (roomDetails.length === 3) {
        lastRoomNumber++
        console.log('lastRoomNumber');
        console.log(lastRoomNumber)
        roomsAvailable.shift()
        roomsAvailable.push(`room${lastRoomNumber}`)
        io.to(socket.id).emit('update-my-room', { player, room: roomsAvailable[0] })
        socket.leave(room)
        socket.join(roomsAvailable[0])
      }
    })

    socket.on('user-click', (data) => {
      const { room } = data
        io.in(room).emit('click-render', data)
        console.log(data);
    });
});
