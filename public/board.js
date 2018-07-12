var arena = document.querySelector('.arena');
var firstClicked;
var socket = io();

socket.on('connect', () => {
  var attack = document.querySelector('#attack');
  var person = prompt("Please enter your name", "Harry");

  socket.emit('createPlayer', {name:person});

  arena.addEventListener('click', (e) => {
    var clicked = e.path[0].id;
    document.getElementById(e.path[0].id).setAttribute('style', `background: #fff`);
    socket.emit('coords', e.path[0].id);
  });
  
  attack.addEventListener('click', () => {
    socket.emit('attack');    
  });
});

socket.on('startTime', function(socketId) {
  socket.emit('turnToOther', socketId);
});

socket.on('turnTime', function(message) {
  var h3 = document.querySelector('h3');
  h3.innerHTML = message;
});

socket.on('loadOtherPlayers', function(coords) {
  console.log(coords);  
  arena.innerHTML = ' ';
  createBoard();
  coords.forEach(key => {
    var color = key.color;
    var coordsKey = key.territories;  
    coordsKey.forEach(el => { 
      document.getElementById(el).setAttribute('style', `background: ${color}`);
    });
  });
  
});


socket.on('createCoords', function (coords) {
  var color = coords.color;
  var coords = coords.territories;
  coords.forEach(el => {
    document.getElementById(el).setAttribute('style', `background: ${color}`);  
  });
});

const createBoard = () => {
  for (var i = 0; i < 8; i++) {
    var tr = document.createElement('tr');
    arena.insertAdjacentElement('beforeend', tr);
    for (var j = 0; j < 8; j++) {
      var td = document.createElement('td');
      td.setAttribute("id", `${i}${j}`);
      tr.insertAdjacentElement('beforeend', td);
    }
  }
}

createBoard();