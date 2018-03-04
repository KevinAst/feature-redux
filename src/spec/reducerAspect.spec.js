import React            from 'react';
import {createFeature,
        managedExpansion,
        launchApp}      from 'feature-u';
import createAspect$    from './createAspect$';
import {reducerAspect,
        slicedReducer}  from '..'; // modules under test


describe('reducerAspect() tests', () => {

  describe('validate reducerAspect.name', () => {

    test('reducerAspect.name', () => {
      expect( reducerAspect.name)
        .toEqual('reducer');
    });

  });


  describe('insure assembleAspectResources() middleware accumulation handles all 3 scenarios', () => {

    const aspects = [ // here are the 3 scenarios
      createAspect$({
        name: 'aspectWithNoMiddleware',
      }),
      createAspect$({
        name: 'aspectWithNullMiddleware',
        getReduxMiddleware: () => null,
      }),
      createAspect$({
        name: 'aspectWithMiddleware',
        getReduxMiddleware: () => 'simulated midleware',
      }),
    ];

    let original_createReduxStore$ = null;
    beforeEach(() => {
      original_createReduxStore$ = reducerAspect.config.createReduxStore$;
      reducerAspect.config.createReduxStore$ = function(appReducer, middlewareArr) {
        // simulate createStore ... just pass back the middlewareArr to be tested
        return middlewareArr;
      };
      launchApp.diag.logf.enable(); // excercise logs (to insure there is NO coding bugs)
    });      
    afterEach(() => {
      // reset everything back to original
      reducerAspect.config.createReduxStore$ = original_createReduxStore$;
      launchApp.diag.logf.disable();
    });

    test('perform the test', () => {
      reducerAspect.assembleAspectResources('simulated app', aspects);
      expect(reducerAspect.appStore)
        .toEqual(['simulated midleware']);
    });
  });


  describe('full-blown redux test configured with reducerAspect', () => {

    // NOTE: also testing:
    //        - slicedReducer()
    //        - managedExpansion()
    const rawReducer = (state=null, action) => 'feature1_state';
    const reducer    = slicedReducer('feature1',
                                     managedExpansion( (app) => rawReducer ));

    const feature1 = createFeature({
      name:    'feature1',
      reducer,
      // prevent <Provider> from complaining about NO children
      // by injecting any dummy DOM content (via appWillStart())
      // ... eslint mistakenly seeing this as a react component (see: eslint-disable-line)
      appWillStart({app, curRootAppElm}) { // eslint-disable-line react/prop-types
        return <p>This is a test</p>;
      },
    });

    launchApp({

      aspects: [
        reducerAspect
      ],

      features: [
        feature1,
      ],

      registerRootAppElm(rootAppElm) {
        // don't care
      }
    });

    const store = reducerAspect.getReduxStore();

    const appState = store.getState();

    test('verify appState configured from feature-redux', () => {
      expect( reducer.getSlicedState(appState)) // NOTE: also testing slicedReducer's getSlicedState()
        .toEqual('feature1_state');
    });

  });

});
