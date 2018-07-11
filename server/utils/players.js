class player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.territories = [];
    this.power = 9;
    this.turn = false;
    this.capture = 0;
  }

  addTerritory(territory) {
    this.territories.push(territory);
  } 
}

module.exports.player = player;