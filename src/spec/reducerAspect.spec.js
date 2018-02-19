import {reducerAspect}  from '../../tooling/ModuleUnderTest';

describe('reducerAspect() tests', () => {

  test('name', () => {
    expect( reducerAspect.name)
      .toEqual('reducer');
  });

});
