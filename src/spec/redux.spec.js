import React            from 'react';
import {createFeature,
        launchApp}      from 'feature-u';
import {reducerAspect,
        slicedReducer}  from '../../tooling/ModuleUnderTest'; // ?? '../index.js';

describe('full redux test configured with reducerAspect', () => {

  const feature1 = createFeature({
    name:    'feature1',
    reducer: slicedReducer('feature1',
                           (state=null, action) => 'feature1_state'),
    appWillStart() { // named params NOT USED: {app, curRootAppElm} ... lint giving me: 'app' is missing in props validation ... don't understand: a react/prop-types lint rule
      return <p>This is a test</p>; // do this so <Provider> won't complain about null children
    }

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
    expect( appState.feature1)
      .toEqual('feature1_state');
  });

});
