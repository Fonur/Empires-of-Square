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
});
