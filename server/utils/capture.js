var territories = [];

function captureTerritory(player) {
  territories.forEach(territory => {
    player.territories.push(territory);
  });
}

function selectTerritory(player, clicked) { 
  var beforeClick = false;
  player.territories.forEach(el => {
    console.log(typeof el);
    console.log(typeof clicked);
    
    if(el === clicked) {
      beforeClick = true;
    }
  });
  if (checkPower(player) && !beforeClick) {
    if (territories.length < 1 && player.turn === true) {
      territories.push(clicked);
      player.capture++;
    } else if (nearestSquare(clicked, player.territories) && checkTerritories(player.territories, clicked) && player.turn === true) {
      territories.push(clicked);
      player.capture++;
    }
  }
}

function attack(player) {
  if (coinFlip()) {
    captureTerritory(player, territories);
    territories = [];
  }
  territories = [];
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

const checkTerritories = (arr, val) => {
  return arr.indexOf(val) === -1
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

module.exports.captureTerritory = captureTerritory;
module.exports.selectTerritory = selectTerritory;
module.exports.attack = attack;