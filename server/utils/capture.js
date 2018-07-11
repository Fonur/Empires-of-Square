function captureTerritory (player, clicked) {
  console.log(typeof player.turn);
  
  
  if (player.territories.length < 1 && player.turn === true) {
    player.addTerritory(clicked);      
    return true;
  } else if (nearestSquare(clicked, player.territories) && checkTerritories(player.territories, clicked) && player.turn === true) {
    player.addTerritory(clicked);
    return true;
  }
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