const {removeTerritory, selectTerritory} = require('./capture');
const expect = require('expect');

var player = {
  id: '9_rqAZagSQBPg4_pAAAB',
  name: { name: 'Fikret' },
  color: '#fc8d44',
  territories: [ '06', '05'],
  power: 9,
  turn: true,
  capture: 9 
}

describe('Capture test', () => {
  it('should remove territory from player s ', () => {
    var clicked = '06';
    removeTerritory(player, clicked);
    expect(player.territories).toEqual(expect.not.arrayContaining(['06']));
    expect(player.territories).toEqual(expect.arrayContaining(['05']));
    expect(player.territories.length).toBe(1);
    })
  it('should add only 06', () => {    
    
    var add = '04';  
    selectTerritory(player, add);
    expect(player.territories).toEqual(expect.arrayContaining(['05', '04']));
  });
  });
