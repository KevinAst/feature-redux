import {createFeature,
        launchApp}           from 'feature-u';
import {createReducerAspect} from '..'; // modules under test

const reducerAspect = createReducerAspect();


// NOTE: This test is broken out into a separate module to clear
//       any residual reducerAspect state as a result of invoking
//       launchApp() on it!
describe('checkAspectContentIsFunction', () => {

  const bad_launchApp = () => launchApp({
    aspects: [
      reducerAspect
    ],

    features: [
      createFeature({
        name:    'feature1',
        reducer: 'I am NOT a reducer',
      }),
    ],
    registerRootAppElm(rootAppElm) {
      // don't care
    }
  });

  test('validate function', () => {
    expect(bad_launchApp)
      .toThrow(/reducer .* must be a function/);
    // THROW: createFeature() parameter violation: reducer (when supplied) must be a function
  });

});
