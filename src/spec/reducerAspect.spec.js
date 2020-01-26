import React            from 'react';
import {createFeature,
        expandWithFassets,
        launchApp}      from 'feature-u';
import createAspect$    from './createAspect$';
import {createReducerAspect,
        slicedReducer}  from '..'; // modules under test

const reducerAspect = createReducerAspect();


describe('reducerAspect() tests', () => {

  describe('validate reducerAspect.name', () => {

    test('reducerAspect.name', () => {
      expect( reducerAspect.name)
        .toEqual('reducer');
    });

  });

  describe('validate createReducerAspect() parameter violation', () => {

    expect( () => createReducerAspect(null) )
      .toThrow(/name is required/);
    // THROW: createReducerAspect() parameter violation: name is required

    expect( () => createReducerAspect(123) )
      .toThrow(/name must be a string/);
    // THROW: createReducerAspect() parameter violation: name must be a string

  });


  describe('verify reducerAspect.getReduxStore() can only be called after a successful launchApp()', () => {

    expect(reducerAspect.appStore)
      .toBe(undefined);

    // NOTE: don't undersand this ... for some reason adding test to the process causes it NOT to throw
    expect( () => reducerAspect.getReduxStore() )
      .toThrow(/reducerAspect.getReduxStore.*can only be called after a successful launchApp/);
    // THROW: ***ERROR*** feature-redux reducerAspect.getReduxStore() can only be called after a successful launchApp() execution

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
      reducerAspect.assembleAspectResources('simulated fassets', aspects);
      expect(reducerAspect.appStore)
        .toEqual(['simulated midleware']);
    });
  });


  describe('insure assembleAspectResources() enhance accumulation handles all 3 scenarios', () => {

    const aspects = [ // here are the 3 scenarios
      createAspect$({
        name: 'aspectWithNoEnhancer',
      }),
      createAspect$({
        name: 'aspectWithNullEnhancer',
        getReduxEnhancer: () => null,
      }),
      createAspect$({
        name: 'aspectWithEnhancer',
        getReduxEnhancer: () => 'simulated enhancer',
      }),
    ];

    let original_createReduxStore$ = null;
    beforeEach(() => {
      original_createReduxStore$ = reducerAspect.config.createReduxStore$;
      reducerAspect.config.createReduxStore$ = function (appReducer, middlewareArr, enhancerArr) {
        // simulate createStore ... just pass back the enhancerArr to be tested
        return enhancerArr;
      };
      launchApp.diag.logf.enable(); // excercise logs (to insure there is NO coding bugs)
    });
    afterEach(() => {
      // reset everything back to original
      reducerAspect.config.createReduxStore$ = original_createReduxStore$;
      launchApp.diag.logf.disable();
    });

    test('perform the test', () => {
      reducerAspect.assembleAspectResources('simulated fassets', aspects);
      expect(reducerAspect.appStore)
        .toEqual(['simulated enhancer']);
    });
  });


  describe('full-blown redux test configured with reducerAspect', () => {

    // NOTE: also testing:
    //        - slicedReducer()
    //        - expandWithFassets()
    const rawReducer = (state=null, action) => 'feature1_state';
    const reducer    = slicedReducer('feature1',
                                     expandWithFassets( (fassets) => rawReducer ));

    const feature1 = createFeature({
      name:    'feature1',
      reducer,
      // prevent <Provider> from complaining about NO children
      // by injecting any dummy DOM content (via appWillStart())
      // ... eslint mistakenly seeing this as a react component (see: eslint-disable-line)
      appWillStart({fassets, curRootAppElm}) { // eslint-disable-line react/prop-types
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
