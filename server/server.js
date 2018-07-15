var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');
var port = process.env.PORT || 3000;

const { player } = require('./utils/players');
const { beforeClick, failCapture, selectTerritory, removeTerritory, attack} = require('./utils/capture');

var connects = [];
var randomColor = require('randomcolor');
var p = [];
var started = [];
var countPlayer = 0;
var turnMachine;
var remainTime;
var round = 0;
var room;

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
      loadOtherPlayers();
    } 
  });

  const loadOtherPlayers = () => {
    var players = [], currentPlayer;
    currentPlayer = p[socket.id];
    countPlayer = 0;
    for (var i in io.sockets.connected) {
      if (p[i].room === room) {
        var s = io.sockets.connected[i];
        connects[countPlayer] = s.id;
        countPlayer++;
        players.push(p[s.id]);
      }
    }
    io.to(room).emit('loadOtherPlayers', players);
  }
  
  socket.on('createPlayer', function (name, roomName, playerCount) {
    var playerCount = getCountPlayer(playerCount);
    room = roomName;
    
    socket.join(room);
    p[socket.id] = new player(socket.id, name, color, room);
    console.log(room);    
    loadOtherPlayers();
    started[room] = false;
    console.log(countPlayer);
    
    if(countPlayer === playerCount && !started[room]) {
      started[room] = true;
      socket.emit('startTime', socket.id);
      console.log(`${socket.id}'s time started`);
    }
  });

  socket.on('turnToOther', function (socketId) {
    if (started[room])
      turnTime(socketId);
  });
  
  socket.on('coords', function (clicked) {
    console.log(p[socket.id].turn);
    if (p[socket.id].turn) {
      if (!beforeClick(p[socket.id], clicked)) {
        selectTerritory(p, p[socket.id], clicked);
      } else {
        removeTerritory(p[socket.id], clicked);
      }
    }
  });

  socket.on('pass', function() {
    if (p[socket.id].turn) {
      remainTime = -1;
    }
  });

  socket.on('attack', function() {
    if (p[socket.id].turn) {
      attack(p[socket.id], round);
      round++;
      remainTime = -1; // pass turn
      io.to(room).emit('createCoords', {
        territories: p[socket.id].territories,
        color: p[socket.id].color
      });
      loadOtherPlayers();
    }
  });
});

const getCountPlayer = (playerCount) => {
  return parseInt(playerCount.substring(0, 1));
}

const turnTime = (socketId) => {
  if (room === p[socketId].room) {
  p[socketId].turn = true;
  remainTime = 30;
    turnMachine = setInterval(() => {
      if (remainTime < 1)
      {
        var nextId = connects[getNextPlayer(socketId)];
        playerRound(nextId);
        socketId = nextId;
        p[socketId].capture = 0;
        remainTime = 30;
        round++;
      }
      io.to(room).emit('turnTime', `${Object.values(p[socketId].name)}'s turn. ${remainTime}`);
      remainTime--;
    }, 1000);
  }
}

const playerRound = (socketId) => {
  connects.forEach(el => {
    if (el === socketId) {
      p[el].turn = true;
    } else {
    p[el].turn = false;
    }
  });
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

server.listen(port);