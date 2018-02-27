import {slicedReducer}  from '..'; // modules under test

describe('slicedReducer() tests', () => {

  //***--------------------------------------------------------------------------------
  describe('VERIFY parameters', () => {

    test('slice is required', () => {
      expect(()=>slicedReducer())
        .toThrow(/slice is required/);
      // THROW: slicedReducer() parameter violation: slice is required
    });

    test('slice must be a string', () => {
      expect(()=>slicedReducer(123))
        .toThrow(/slice must be a string/);
      // THROW: slicedReducer() parameter violation: slice must be a string
    });

    test('reducer is required', () => {
      expect(()=>slicedReducer('my.slice'))
        .toThrow(/reducer is required/);
      // THROW: slicedReducer() parameter violation: reducer is required
    });

    test('reducer must be a function', () => {
      expect(()=>slicedReducer('my.slice', 123))
        .toThrow(/reducer must be a function/);
      // THROW: slicedReducer() parameter violation: reducer must be a function
    });

  });


  //***--------------------------------------------------------------------------------
  describe('VERIFY embellishment', () => {

    const myReducer = (state=null, action) => 'myReducerState';

    slicedReducer('my.slice', myReducer);

    test('reducer.slice', () => {
      expect(myReducer.slice)
        .toBe('my.slice');
    });

    const myState = {
      my: {
        slice: 'myReducerState'
      }
    };

    test('reducer.getSlicedState', () => {
      expect(myReducer.getSlicedState(myState))
        .toBe('myReducerState');
    });


  });

});
