const {removeTerritory, selectTerritory, attack, capturedTerritory} = require('./capture');
const expect = require('expect');

var player = [];

beforeEach(function() {
  player[0] = {
    id: '9_rqAZagSQBPg4_pAAAB',
    name: { name: 'Fikret' },
    color: '#fc8d44',
    territories: ['14', '13'],
    power: 9,
    turn: true,
    capture: 9 
  };
  player[1] = {
    id: '9_rqAZagSQBPg4_pasAB',
    name: { name: 'Fikret' },
    color: '#fc8d44',
    territories: ['23', '24'],
    power: 9,
    turn: true,
    capture: 9 
  };
});

describe('Capture test', () => {  
  it('should capture other player\'s territory when attacked', () => {
    selectTerritory(player, player[0], '24');
    expect(player[0].territories).toEqual(expect.arrayContaining(['14', '13', '24']));
    expect(player[1].territories).toEqual(expect.not.arrayContaining(['24']));
  });

  // it('Remove it from other players', () => {
  //   capturedTerritory(player, '06');
  //   expect(player[0].territories).toEqual(expect.not.arrayContaining(['06']));
  //   expect(player[1].territories).toEqual(expect.not.arrayContaining(['06']));
  //   expect(player[1].power).toBe(8);
    
  // });
});
