import {createFeature,
        launchApp}      from 'feature-u';
import {reducerAspect}  from '..'; // modules under test

// NOTE: Because of the way extended Aspect properties are managed (in
//       global module space) we can only invoke ONE launchApp() per unit
//       test module.
//       ... that is why this test is isolated here
//       ... BECAUSE: reducerAspect invokes feature-u's: extendAspectProperty('getReduxStore')
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
    // THROW: createFeature() parameter violation: reducer (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).
  });

});
