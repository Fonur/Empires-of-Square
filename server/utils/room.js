class room {
  constructor(name, started) {    
    this.name = name;    
    this.started = started;
    this.players = [];
    this.countPlayer = 0;
  }

  addPlayerToRoom(player) {
    this.players.push(player);
  }

  hasPlayer(player) {
    var playerStatus = false;
    for (var currentPlayer in this.players) {
      if (player === this.players[currentPlayer]) {
        playerStatus = true;
      }
    }
    return playerStatus;
  } 
}

module.exports.room = room;