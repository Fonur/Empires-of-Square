var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');
const { player } = require('./utils/players');
const { captureTerritory} = require('./utils/capture');
var randomColor = require('randomcolor');

var p = [];

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', function (socket) {
  var color = randomColor();

  socket.on('createPlayer', function (name) {
    p[socket.id] = new player(socket.id, name, color);   
    for (var i in io.sockets.connected) {
      var s = io.sockets.connected[i];
      if (socket.id === s.id) {
         continue;
      }
      socket.emit('loadOtherPlayers', p[s.id]);
    } 
  });

  socket.on('coords', function (clicked) {  
    if(captureTerritory(p[socket.id], clicked)) {
      io.emit('createCoords', {
        clicked: clicked,
        territories: player.territories,
        color: color
      });
    }
  });
});

io.on('forceDisconnect', function () {
  socket.disconnect();
});


server.listen(3000);