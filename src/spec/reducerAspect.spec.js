import {reducerAspect}  from '..'; // STOP USING: '../../tooling/ModuleUnderTest';

describe('reducerAspect() tests', () => {

  test('name', () => {
    expect( reducerAspect.name)
      .toEqual('reducer');
  });

});
