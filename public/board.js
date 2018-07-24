var arena = document.querySelector('.arena');
var firstClicked;
var socket = io();
var selected = 0;
var person;
var power;

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

  arena.addEventListener('click', (e) => {
    var clicked = e.path[0].id;
    var capture = document.getElementById('territory');
    power = document.getElementById('power');
    var colorSquare = document.getElementById(clicked).style.background;    

    console.log(colorSquare);
    
    if (colorSquare === 'rgb(255, 255, 255)') {
      document.getElementById(clicked).setAttribute('style', `background: rgb(230, 198, 111);`);
      capture.innerText = --selected;
    } else if(colorSquare === 'rgb(230, 198, 111)') {
      document.getElementById(clicked).setAttribute('style', `background: #fff`);
      capture.innerText = ++selected;
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
  var kisiler = document.querySelector('.kisiler');
  var power = document.getElementById('power'); 

  kisiler.innerHTML = ' ';
  selected = 0;  
  console.log(coords);  
  arena.innerHTML = ' ';
  
  createBoard();

  coords.forEach(key => {
    var personName = Object.values(key.name)[0];     
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