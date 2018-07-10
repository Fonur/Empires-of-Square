class player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.territories = [];
    this.turn = false;
  }

  addTerritory(territory) {
    this.territories.push(territory);
  } 
}

module.exports.player = player;