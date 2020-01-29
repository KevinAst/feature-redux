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

    expect( () => createReducerAspect() )
      .not.toThrow(); // all default params is acceptable

    expect( () => createReducerAspect(null) )
      .toThrow(/only named parameters may be supplied/);
    // THROW: createReducerAspect() parameter violation: only named parameters may be supplied

    expect( () => createReducerAspect(123) )
      .toThrow(/only named parameters may be supplied/);
    // THROW: createReducerAspect() parameter violation: only named parameters may be supplied

    expect( () => createReducerAspect('myName BUT NOT positional :-(') )
      .toThrow(/only named parameters may be supplied/);
    // THROW: createReducerAspect() parameter violation: only named parameters may be supplied

    expect( () => createReducerAspect({name: 123}) )
      .toThrow(/name must be a string/);
    // THROW: createReducerAspect() parameter violation: name must be a string

    expect( () => createReducerAspect({name: 'myName', badParam1: 123, badParm2: 456}) )
      .toThrow(/unrecognized named parameter.*badParam1.*badParm2/);
    // THROW: createReducerAspect() parameter violation: unrecognized named parameter(s): badParam1,badParm2

    expect( () => createReducerAspect({name: 'myName'}, 'badPositional') )
      .toThrow(/unrecognized positional parameters.*only named parameters can be specified.*2 arguments were supplied/);
    // THROW: createReducerAspect() parameter violation: unrecognized positional parameters (only named parameters can be specified) ... 2 arguments were supplied

  });


  describe('verify reducerAspect.getReduxStore() can only be called after a successful launchApp()', () => {

    expect(reducerAspect.appStore)
      .toBe(undefined);

    // NOTE: don't understand this ... for some reason adding test to the process causes it NOT to throw
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
        getReduxMiddleware: () => 'simulated middleware',
      }),
    ];

    let original_createReduxStore$ = null;
    beforeEach(() => {
      original_createReduxStore$ = reducerAspect.config.createReduxStore$;
      reducerAspect.config.createReduxStore$ = function(appReducer, middlewareArr) {
        // simulate createStore ... just pass back the middlewareArr to be tested
        return middlewareArr;
      };
      launchApp.diag.logf.enable(); // exercise logs (to insure there is NO coding bugs)
    });      
    afterEach(() => {
      // reset everything back to original
      reducerAspect.config.createReduxStore$ = original_createReduxStore$;
      launchApp.diag.logf.disable();
    });

    test('perform the test', () => {
      reducerAspect.assembleAspectResources('simulated fassets', aspects);
      expect(reducerAspect.appStore)
        .toEqual(['simulated middleware']);
    });
  });


  describe('insure assembleAspectResources() enhancer accumulation handles all 3 scenarios', () => {

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
      launchApp.diag.logf.enable(); // exercise logs (to insure there is NO coding bugs)
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

  // NOTE: introduced by @sylvainlg
  describe('insure createReduxStore$() succeeds error with enhancers', () => {

    // our single enhancer
    const dummyReducerEnhancer = (createStore) => (reducer,
                                                   initialState,
                                                   enhancer) => {
      const dummyReducer = (state, action) => {
        const newState = reducer(state, action);
        return newState;
      };
      return createStore(dummyReducer, initialState, enhancer);
    };

    test('perform the test', () => {
      // invoke our internal createReduxStore$() with a single enhancer
      // ... NOTE: this is invoking our real code
      const store = reducerAspect.config.createReduxStore$(state => state, [], [dummyReducerEnhancer]);
      // insure it succeeded ... KJB: can't get it to fail - even with missing spread operator (the reason this test was created)
      expect(store).toBeInstanceOf(Object);
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
