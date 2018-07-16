
var territories = [];

function failCapture(player) {
  for (var i = 0; player.capture > i; i++) 
  {
    player.territories.pop();          
  }
  territories = [];
}

function beforeClick(player, clicked) {
  var durum = false;
  player.territories.forEach(el => {
    if(el === clicked) {
      durum = true;
    }
  });
  return durum;
}

function selectTerritory(players, player, clicked, round) { 
  var captured = true;

  if (round <= 2)
  {
    captured = checkCaptured(players, clicked);        
  } else {
    capturedTerritory(players, clicked);
  }
  
  if (checkPower(player) && !beforeClick(player, clicked) && player.turn == true) {
    if (player.territories.length < 1 && !captured) {
      territories.push(clicked);
      player.capture++;
      player.territories.push(clicked);
    } else if (nearestSquare(clicked, player.territories) && player.turn === true && !captured) {
      territories.push(clicked);
      player.territories.push(clicked);
      player.capture++;
    }
  }
}

function removeTerritory(player, clicked) {
  var index = territories.indexOf(clicked);
  player.territories.splice(index, 1);
  territories.splice(index, 1);
  player.capture--;
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

function checkCaptured(players, clicked) {
  var check = false;
  for (var player in players) {
    players[player].territories.forEach((territory, i) => {
      if (territory === clicked)
      {
        check = true;
      }
    });
  }
  return check
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
    var x = clicked.substring(0, 1);
    var y = clicked.substring(1, 2);

    var baseX = base[i].substring(0, 1);
    var baseY = base[i].substring(1, 2);

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