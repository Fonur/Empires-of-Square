var arena = document.querySelector('.arena');
var firstClicked;
var socket = io();

socket.on('connect', () => {
  
  var person = prompt("Please enter your name", "Harry");

  socket.emit('createPlayer', {name:person});

  arena.addEventListener('click', (e) => {
    var clicked = e.path[0].id;
    socket.emit('coords', e.path[0].id);
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
  document.querySelector('.arena').innerHTML = '';
  createBoard();
  var color = coords.color;
  var coords = coords.territories;  
  coords.forEach(el => {
    document.getElementById(el).setAttribute('style', `background: ${color}`);
  });
});

socket.on('createCoords', function (coords) {
  var clicked = coords.clicked;
  var color = coords.color;
  var coords = coords.territories;
  document.getElementById(clicked).setAttribute('style', `background: ${color}`);  
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