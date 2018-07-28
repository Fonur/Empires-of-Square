var territories = [];

function failCapture(player) {
  territories.forEach((el, i) => {
    removeTerritory(player, el);

    if (i === territories.length)
    {
      territories = [];
    }
  });

  
}

function beforeClick(player, clicked) {  
  var i = 0;

  for (var territory in player.territories) {
    if(player.territories[territory] === clicked) {
      return true;
    }
    
    if (i === player.territories.length)
      return false;
    i++;
  }  
}

function selectTerritory(players, player, clicked, round) { 
  capturedTerritory(players, clicked);
  
  if (checkPower(player) && !beforeClick(player, clicked) && player.turn == true) {
    if (player.territories.length < 1) {
      territories.push(clicked);
      player.capture++;
      player.territories.push(clicked);
    } else if (nearestSquare(clicked, player.territories) && player.turn === true) {
      territories.push(clicked);
      player.territories.push(clicked);
      player.capture++;
    }
  }
}

function removeTerritory(player, clicked) {
  var index = territories.indexOf(clicked);
  if (index > -1) {    
    territories.splice(index, 1);
    player.capture--;   
    
    index = player.territories.indexOf(clicked);
    if (index > -1)
      player.territories.splice(index, 1);
  }
}

function attack(player, round) {
  console.log(player);
  if (2 >= round) {    
    player.power = player.territories.length;
    territories = [];
  }
  else if (coinFlip()) {
    failCapture(player, territories);
  } else { 
    player.power = player.territories.length;
    territories = [];
  }
}
 
function capturedTerritory(players, clicked) {
  for (var player in players) {
    players[player].territories.forEach((territory, i) => {
      if (territory === clicked)
      {
        players[player].territories.splice(i, 1);
        players[player].power--;
      }
    });
  }
}

function toggleTerritory(p, player, clicked, round) {
  if (!beforeClick(player, clicked)) {
    selectTerritory(p, player, clicked, round);
  } else {
    removeTerritory(player, clicked);
  }
}

function checkPower(player) {
  if (player.power > player.capture) {
    return true;
  }
  return false;
}

function coinFlip() {
  if (Math.floor(Math.random() * 2) == 0)
    return true;
  return false;
}

const nearestSquare = (clicked, base) => {
  for (var i = 0; i < base.length; i++) {
    var x = clicked.substring(0, 2);
    var y = clicked.substring(2, 4);

    var baseX = base[i].substring(0, 2);
    var baseY = base[i].substring(2, 4);

    if (baseX === x && Math.abs(baseY - y) === 1) {
      return true;
    } else if (baseY === y && Math.abs(baseX - x) === 1) {
      return true;
    }
  }
}

module.exports.captureTerritory = failCapture;
module.exports.selectTerritory = selectTerritory;
module.exports.attack = attack;
module.exports.beforeClick = beforeClick;
module.exports.removeTerritory = removeTerritory;
module.exports.capturedTerritory = capturedTerritory;
module.exports.toggleTerritory = toggleTerritory;
module.exports.failCapture = failCapture;