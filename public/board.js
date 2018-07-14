var arena = document.querySelector('.arena');
var firstClicked;
var socket = io();
var selected = 0;

socket.on('connect', () => {
  var attack = document.querySelector('#attack');
  var person = prompt("Please enter your name", "Harry");
  var kisiler = document.querySelector('.kisiler');
  var pass = document.querySelector('#pass');

  kisiler.innerHTML = `<h1><span class="badge badge-secondary">${person}</span></h1> `;

  socket.emit('createPlayer', {name:person});

  pass.addEventListener('click', () => {
    socket.emit('pass');
  });

  arena.addEventListener('click', (e) => {
    var clicked = e.path[0].id;
    var capture = document.getElementById('territory');
    var colorSquare = document.getElementById(clicked).style.background;
    console.log(colorSquare);
    
    if (colorSquare === 'rgb(255, 255, 255)') {
      document.getElementById(clicked).setAttribute('style', `background: rgb(230, 198, 111);`);
      capture.value = --selected;
    } else {
      document.getElementById(clicked).setAttribute('style', `background: #fff`);
      capture.value = ++selected;
    }
    
    socket.emit('coords', clicked);
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
  var power = document.getElementById('power');
  selected = 0;
  
  console.log(coords);  
  arena.innerHTML = ' ';
  createBoard();
  coords.forEach(key => {
    var color = key.color;
    var coordsKey = key.territories;  
    coordsKey.forEach(el => { 
      if (el.id === socket.id) {        
        power.value = el.power;
      }
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