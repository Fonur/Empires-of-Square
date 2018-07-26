var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');

var port = process.env.PORT || 3000;

const {
  player
} = require('./utils/players');

const {
  selectRandom
} = require('./utils/startRandom');

const {
  beforeClick,
  failCapture,
  selectTerritory,
  removeTerritory,
  attack,
  toggleTerritory
} = require('./utils/capture');

const {
  room
} = require('./utils/room');

var randomColor = require('randomcolor');
var p = [];
var rooms = []; 
var countPlayer;
var currentId;
var turnMachine;
var round = 0;
var currentRoom;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', function (socket) {
  var color = randomColor();
  currentId = socket.id;

  socket.on('disconnect', (socket) => {    
    if (p[socket.id]) {
      loadOtherPlayers();
    }
  });

  const loadOtherPlayers = () => {        
    var currentPlayer = p[socket.id];        
    currentRoom = rooms[currentPlayer.room];

    countPlayer = 0;
    if (currentRoom) {
      for (var i in io.sockets.connected) {      
        if (currentRoom.hasPlayer(p[i])) {             
          var s = io.sockets.connected[i];
          rooms[currentPlayer.room].connects[countPlayer] = s.id;          
          
          countPlayer++;
        }
      }
      io.to(currentPlayer.room).emit('loadOtherPlayers', currentRoom.players);
    }
  }

  socket.on('createPlayer', function (name, roomName, playerCount) {
    
    var maxPlayer = parseInt(playerCount.substring(0, 1));

    if (!rooms[roomName])
      rooms[roomName] = new room(roomName, false);

    if (maxPlayer > rooms[roomName].countPlayer) {
      socket.join(roomName);

      p[socket.id] = new player(socket.id, name, color, roomName);
      p[socket.id].territories = selectRandom();


      rooms[roomName].addPlayerToRoom(p[socket.id]);
      rooms[roomName].countPlayer++;

      loadOtherPlayers();

      if (rooms[roomName].countPlayer === maxPlayer) {
        rooms[roomName].started = true;
        socket.emit('startTime', socket.id);
      }
    } else {
      socket.disconnect();
    }
  });

  socket.on('turnToOther', function (socketId) {
      turnTime(socketId);
  });

  socket.on('coords', function (clicked) {
    if (p[socket.id].turn) {
      toggleTerritory(p, p[socket.id], clicked, round);      
    }
  });

  socket.on('pass', function () {
    
    if (p[socket.id].turn) {
      rooms[p[socket.id].room].remainTime = -1;
    }
  });

  socket.on('attack', function () {
    if (p[socket.id].turn) {
      attack(p[socket.id], round);
      round++;
      rooms[p[socket.id].room].remainTime = -1; // pass turn
      io.to(p[socket.id].room).emit('createCoords', {
        territories: p[socket.id].territories,
        color: p[socket.id].color
      });
      loadOtherPlayers();
    }
  });
});

const turnTime = (socketId) => {
  var currentRoom = p[socketId].room;    
  p[socketId].turn = true;
  rooms[p[socketId].room].remainTime = 30;

    setInterval(() => {
    if (rooms[p[socketId].room].remainTime < 1) {
      var nextId = rooms[currentRoom].connects[getNextPlayer(socketId)];
      playerRound(nextId);
      socketId = nextId;
      p[socketId].capture = 0;
      rooms[p[socketId].room].remainTime = 30;
    }
    
    io.to(currentRoom).emit('turnTime', `${Object.values(p[socketId].name)}'s turn. ${rooms[p[socketId].room].remainTime}`);    

  rooms[p[socketId].room].remainTime--;
  }, 1000);
}

const playerRound = (socketId) => {
  currentRoom = p[socketId].room;

  rooms[currentRoom].connects.forEach(el => {
    if (el === socketId) {
      p[el].turn = true;
    } else {
      p[el].turn = false;
    }
  });
}

const getNextPlayer = (socketId) => {
  currentRoom = rooms[p[socketId].room];  
  
  var dondur = 0;
  var playerList = currentRoom.connects;
  
  playerList.forEach((el, i) => {
    var nextPlayer = p[playerList[i + 1]];
    if (nextPlayer) {
      var nextPlayerRoom = rooms[nextPlayer.room];
      if (el === socketId && i != (playerList.length - 1) && nextPlayerRoom.hasPlayer(p[playerList[i + 1]])) {
        dondur = i + 1;
      }
    }
  });
  return dondur;
}

server.listen(port);