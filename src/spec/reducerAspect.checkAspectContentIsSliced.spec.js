import {createFeature,
        launchApp}           from 'feature-u';
import {createReducerAspect} from '..'; // modules under test

const reducerAspect = createReducerAspect();

// NOTE: This test is broken out into a separate module to clear
//       any residual reducerAspect state as a result of invoking
//       launchApp() on it!
describe('checkAspectContentIsSliced', () => {

  const nonSlicedReducer = (state=null, action) => 'nonSlicedReducer';

  const bad_launchApp = () => launchApp({
    aspects: [
      reducerAspect
    ],

    features: [
      createFeature({
        name:    'feature1',
        reducer: nonSlicedReducer,
      }),
    ],
    registerRootAppElm(rootAppElm) {
      // don't care
    }
  });

  test('validate function', () => {
    expect(bad_launchApp)
      .toThrow(/reducer .* must be embellished with slicedReducer/);
    // THROW: createFeature() parameter violation: reducer (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when expandWithFassets() is used).
  });

});
