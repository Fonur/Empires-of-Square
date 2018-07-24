const {toggleTerritory, removeTerritory, selectTerritory, attack, capturedTerritory} = require('./capture');
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
    capture: 0
  };
  player[1] = {
    id: '9_rqAZagSQBPg4_pasAB',
    name: { name: 'Fikret' },
    color: '#fc8d44',
    territories: ['23', '24'],
    power: 9,
    turn: true,
    capture: 0
  };
});


describe('Capture tests', () => {
  var clicked = '23';

  it('Should remove value', () => {    
    removeTerritory(player[1], clicked);

    expect(player[1].territories).toEqual(expect.not.arrayContaining(['23']));
  });
  
  it('Select territory', () => {
    clicked = '25';
    selectTerritory(player, player[1], clicked, 9);

    expect(player[1].territories).toEqual(['23','24','25']);
  });

  it('Toggle Territory', () => {
    clicked = '25';
    toggleTerritory(player, player[1], clicked, 9);

    expect(player[1].territories).toEqual(['23','24','25']);

    toggleTerritory(player, player[1], clicked, 9);

    expect(player[1].territories).toEqual(['23','24']);
  });
});
