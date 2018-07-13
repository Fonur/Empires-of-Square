var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

const { player } = require('./utils/players');
const { failCapture, selectTerritory, attack} = require('./utils/capture');

var connects = [];
var randomColor = require('randomcolor');
var p = [];
var started = false;
var countPlayer = 0;
var turnMachine;
var remainTime;
var round = 0;

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
    var players = [];
    countPlayer = 0;
    for (var i in io.sockets.connected) {
      var s = io.sockets.connected[i];
      connects[countPlayer] = s.id;
      countPlayer++; 
      players.push(p[s.id]);                           
    }
    socket.emit('loadOtherPlayers', players);
  }

  socket.on('createPlayer', function (name) {
    p[socket.id] = new player(socket.id, name, color);     
    loadOtherPlayers();
    if(countPlayer === 2 && !started) {
      started = true;
      socket.emit('startTime', socket.id);
      console.log(`${socket.id}'s time started`);
    }
  });

  socket.on('turnToOther', function (socketId) {
    if (started)
      turnTime(socketId);
  });
  
  socket.on('coords', function (clicked) {
    console.log(p[socket.id].turn);
    selectTerritory(p[socket.id], clicked);
  });

  socket.on('pass', function() {
    if (p[socket.id].turn) {
      remainTime = -1;
    }
  });

  socket.on('attack', function() {
    if (p[scoket.id].turn) {
      attack(p[socket.id], round);
      remainTime = -1; // pass turn
      io.emit('createCoords', {
        territories: p[socket.id].territories,
        color: p[socket.id].color
      });
    }
  });
});

const turnTime = (socketId) => {
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
      io.emit('turnTime', `${Object.values(p[socketId].name)}'s turn. ${remainTime}`);
      remainTime--;
    }, 1000);
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

server.listen(3000);