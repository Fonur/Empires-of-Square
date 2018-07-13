var territories = [];

function failCapture(player) {
  for (var i = 0; player.capture > i; i++) 
  {
    player.territories.pop();          
  }
  territories = [];
}

function selectTerritory(player, clicked) { 
  var beforeClick = false;
  player.territories.forEach(el => {        
    if(el === clicked) {
      beforeClick = true;
    }
  });
  
  if (checkPower(player) && !beforeClick) {
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

function attack(player) {
  console.log(player);
  if (coinFlip()) {
    failCapture(player, territories);
  } else { 
  player.power += territories.length;
  territories = [];
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