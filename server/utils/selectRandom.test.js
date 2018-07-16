const {selectRandom} = require('./startRandom');
const expect = require('expect');

describe('Test selectRandom', () => {
  it('Should select random place 3x3', () => {
    expect(selectRandom().length).toBe(9);
  });
});