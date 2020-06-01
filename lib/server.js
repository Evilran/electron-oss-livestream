const express = require('express');
const config = require('./config');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const OSS = require('ali-oss');

const cid = config.channelId;
const conf = config.channelConf;

const client = new OSS(config.OSSConf);

async function createChannel(OSSClient) {
  await OSSClient.putChannel(cid, conf);
  console.log(await OSSClient.getChannel(cid));
}

exports.server = {
  run(port) {
    server.listen(port, () => {
      createChannel(client).catch(error => console.log("Channel creation failed! %s", error.message));
      console.log('Server listening at port %d', port);
    });
  },
};

const users = new Set();

io.on('connection', function onConnection(socket) {
  let username;

  socket.emit('users', { users: Array.from(users) });

  socket.on('message', function onMessage(data) {
    const text = data.text;
    io.sockets.emit('message', { username, text });
  });

  socket.on('login', function onLogin(data) {
    username = data.username;
    users.add(username);
    io.sockets.emit('login', { username, users: Array.from(users) });
  });

  socket.on('typing', function onTyping() {
    socket.broadcast.emit('typing', { username });
  });

  socket.on('stop-typing', function onStopTyping() {
    socket.broadcast.emit('stop-typing', { username });
  });

  socket.on('disconnect', function onDisconnect() {
    users.delete(username);
    socket.broadcast.emit('logout', { username, users: Array.from(users) });
  });
});
