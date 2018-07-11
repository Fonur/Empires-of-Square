var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

const { player } = require('./utils/players');
const { captureTerritory } = require('./utils/capture');

var connects = [];
var randomColor = require('randomcolor');
var p = [];
var started = false;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', function (socket) {
  var color = randomColor();

  socket.on('disconnect', (socket) => {
    p[socket.id] = '';
    p[socket.id].turn = true;
    for (var i in io.sockets.connected) {
      var s = io.sockets.connected[i];
      if (socket.id === s.id) {
        continue;
      }
      io.emit('loadOtherPlayers', p[s.id]);
    } 
  });

  socket.on('createPlayer', function (name) {
    p[socket.id] = new player(socket.id, name, color);     
    var countPlayer = 0;
      for (var i in io.sockets.connected) {
        var s = io.sockets.connected[i];
        connects[countPlayer] = s.id;
        countPlayer++;                
        if (socket.id === s.id) {
            continue;
        }
        socket.emit('loadOtherPlayers', p[s.id]);
      }

    if(countPlayer >= 2 && !started) {
      socket.emit('startTime', socket.id);
      console.log(`${socket.id}'s time started`);
      started = true;
    }
  });

  socket.on('turnToOther', function (socketId) {
    turnTime(socketId);
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


const turnTime = (socketId) => {
  setInterval(() => {
    turnToOther(socketId); 
    var nextId = connects[getNextPlayer(socketId)];
    playerRound(nextId);

    socketId = nextId;
    io.emit('turnTime', `${Object.values(p[socketId].name)}'s turn`);
  }, 5000);
}

  const playerRound = (socketId) => {
    connects.forEach(el => {
      if (el === socketId) {
        p[el].turn = true;
        console.log(p[el]);
      } else {
      p[el].turn = false;
      console.log(p[el]);      
      }
    });
  }

const turnToOther = (socketId) => {
  console.log(JSON.stringify(p[socketId]));
}

const getNextPlayer = (socketId) => {
  var dondur = 0;
  connects.forEach((el, i) => {
    if (el === socketId && i != (connects.length - 1)) {
      dondur = i + 1;
    }
  });
  return dondur;
}

server.listen(3000);