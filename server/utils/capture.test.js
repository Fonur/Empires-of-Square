const {toggleTerritory, removeTerritory, selectTerritory, attack, capturedTerritory, failCapture} = require('./capture');
const expect = require('expect');

var player = [];

beforeEach(function() {
  player = [];
  player[0] = {
    id: '9_rqAZagSQBPg4_pAAAB',
    name: { name: 'Fikret' },
    color: '#fc8d44',
    territories: ['14', '13', '12', '24', '23', '22', '04', '03'],
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
  
  
  it('Select territory', () => {
    clicked = '25';
    selectTerritory(player, player[1], clicked, 9);

    expect(player[1].territories).toEqual(['23','24','25']);
  });

  
  it('Toggle Territory', () => {
    var clicked = '22';
    toggleTerritory(player, player[1], '22', 9);

    expect(player[1].territories).toEqual(['23','24','22']);

    toggleTerritory(player, player[1], '22', 10);

    expect(player[1].territories).toEqual(['23','24']);
    expect(player[1].territories).toEqual(expect.not.arrayContaining(['22']));
  });

  it('Fail capture', () => {
    var clicked = '02';
    toggleTerritory(player, player[0], clicked, 9);
    failCapture(player[0]);
    expect(player[0].territories).toEqual(expect.arrayContaining(['02']));
  });
});