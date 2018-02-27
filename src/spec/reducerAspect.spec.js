import React            from 'react';
import {createFeature,
        managedExpansion,
        launchApp}      from 'feature-u';
import {reducerAspect,
        slicedReducer}  from '..'; // modules under test


describe('reducerAspect() tests', () => {

  describe('validate reducerAspect.name', () => {

    test('reducerAspect.name', () => {
      expect( reducerAspect.name)
        .toEqual('reducer');
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
