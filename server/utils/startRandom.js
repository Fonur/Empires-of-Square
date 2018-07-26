function selectRandom (players){
  var x = Math.floor(Math.random() * 16  + 1);
  var y = Math.floor(Math.random() * 16  + 1);

  var position = [];

  for (var j = y - 1; j <= y + 1; j++) {
    for( var i = x - 1; i <= x + 1; i++) {
      
      if (i < 10 && j >= 10) {
        position.push(`0${i}${j}`);
      } else if (i >= 10 && j < 10) {
        position.push(`${i}0${j}`);
      } else if (i < 10 && j < 10) {
        position.push(`0${i}0${j}`);
      } else {
        position.push(`${i}${j}`);
      }      
    }
  }

  position.forEach(el => {
    if (checkCaptured(players, el)) {
      selectRandom(players);      
    }
  });
  return position;
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


module.exports.selectRandom = selectRandom;