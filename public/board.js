var arena = document.querySelector('.arena');
var firstClicked;
var socket = io();
var selected = 0;
var person;
var playerColor = [];
var power;
var multipleMode = false;

socket.on('connect', () => {
  var attack = document.querySelector('#attack');
  var pass = document.querySelector('#pass');

  var room;
  var playerCount;
  
  person = $.deparam(window.location.search).name;
  room = $.deparam(window.location.search).room;
  playerCount = $.deparam(window.location.search).playerCount;
  socket.emit('createPlayer', {name:person}, room, playerCount);

  pass.addEventListener('click', () => {
    socket.emit('pass');
  });

  arena.addEventListener('contextmenu', e => {
    var clicked = e.path[0].id;
    
    if (!multipleMode) {
      multipleMode = true;
      selectIt(e);
    }
    else 
      multipleMode = false;
    e.preventDefault();
  });

  arena.addEventListener('mouseover', e => {
    if (multipleMode) {
      selectIt(e);
    }
  });

  arena.addEventListener('click', (e) => {
    selectIt(e);
  });

  attack.addEventListener('click', () => {
    socket.emit('attack');    
  });

  function selectIt(e) {
    var clicked = e.path[0].id;    
    var capture = document.getElementById('territory');
    power = document.getElementById('power');
    var colorSquare = document.getElementById(clicked).style.background;    

    console.log(colorSquare.toString());        
    var playColorHex = hexToRgb(playerColor[socket.id]);
    
    if (colorSquare === 'rgb(255, 255, 255)') {
      document.getElementById(clicked).setAttribute('style', `background: rgb(230, 198, 111);`);
      capture.innerText = --selected;
      socket.emit('coords', clicked);
    } else if (colorSquare === 'rgb(230, 198, 111)') {
      document.getElementById(clicked).setAttribute('style', `background: #fff`);
      capture.innerText = ++selected;
      socket.emit('coords', clicked);
    } else if (colorSquare !== playColorHex) {
      document.getElementById(clicked).setAttribute('style', `background: #fff`);
      capture.innerText = ++selected;
      socket.emit('coords', clicked);
    }
  }

});

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g =  parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  return `rgb(${r}, ${g}, ${b})`;
}

socket.on('startTime', function(socketId) {
  socket.emit('turnToOther', socketId);
});

socket.on('turnTime', function(message) {
  var h3 = document.querySelector('h3');
  h3.innerHTML = message;
});

socket.on('loadOtherPlayers', function(coords) {
  var kisiler = document.querySelector('.kisiler');
  var power = document.getElementById('power'); 

  kisiler.innerHTML = ' ';
  selected = 0;    
  arena.innerHTML = ' ';
  
  createBoard();

  coords.forEach(key => {
    var personName = Object.values(key.name)[0];         
    playerColor[key.id] = key.color;
    
    if (personName === person) {
      kisiler.insertAdjacentHTML('beforeend',`<h4><span style="background: ${key.color}; color:#fff">${Object.values(key.name)}</span>  </h4><hr width="250px;">`);
      power.innerText = key.power;      
    } else {
      kisiler.insertAdjacentHTML('beforeend',`<h4>${Object.values(key.name)}</h4><hr width="250px;">`);
    }
    var color = key.color;
    var coordsKey = key.territories;
    coordsKey.forEach(el => { 
      if (el.id === socket.id) {        
        power.value = el.power;
      }
      document.getElementById(el).setAttribute('style', `background: ${color}`);         
    });
  });  

  history.replaceState({}, null, "/"); //Remove params
});

socket.on('createCoords', function (coords) {
  var color = coords.color;
  var coords = coords.territories;
  coords.forEach(el => {
    document.getElementById(el).setAttribute('style', `background: ${color}`);  
  });
});

createBoard();