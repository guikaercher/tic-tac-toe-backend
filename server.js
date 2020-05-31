const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);

app.get('/', (req, res) => {
  res.send('Working!');
});

io.on('connection', (socket) => {
    socket.on('user-click', (data) => {
        socket.emit('click-render', data);
        socket.broadcast.emit('click-render', data);
        console.log(data);
    });
});
