import {createFeature}    from 'feature-u';
import slicedReducer      from '../slicedReducer';
import {accumAppReducer}  from '../reducerAspect'; // function under test (see: NOTE)
// NOTE: on import (above) we specifically do NOT use ../../tooling/ModuleUnderTest
//       BECAUSE we must import the "internal" named export from reducerAspect
//       (that is NOT exposed through the public index.js)

const anyAction = {type: 'any'};

function applyAppState(features, allowNoReducers$=null) {
  // accumulate our top-level app state reducer
  // ... function under test
  const appReducerFn = accumAppReducer('reducer', features, allowNoReducers$);

  // return the appState from running the reducer
  const appState = appReducerFn(undefined, anyAction);
  return appState;
}

const feature1 = createFeature({
  name:    'feature1',
  reducer: slicedReducer('feature1',
                         (state='default-feature1', action) => 'state-for-feature1'),
});

const feature2 = createFeature({
  name:    'feature2',
  reducer: slicedReducer('feature2',
                         (state='default-feature2', action) => 'state-for-feature2'),
});

const feature3 = createFeature({
  name:    'feature3',
  reducer: slicedReducer('complex.slice.feature3',
                         (state='default-feature3', action) => 'state-for-feature3'),
});

const feature4 = createFeature({
  name:    'feature4',
  reducer: slicedReducer('complex.slice', // is an intermediate duplicate from feature3
                         (state='default-feature4', action) => 'state-for-feature4'),
});

const featureWithoutState = createFeature({
  name: 'featureWithoutState',
});

describe('feature-u accumAppReducer() tests', () => {

  test('simple merge', () => {
    expect(applyAppState([feature1, feature2]))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });

  test('simple merge PROVING OVERRIDE allowNoReducers$=myReducerFn IS NOT USED (when Feature.reducer are found', () => {
    expect(applyAppState([feature1, feature2], ()=>'NOT Expecting This Reducer To Be USED'))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });
  
  test('merge complex slices', () => {
    expect(applyAppState([feature1, feature3]))
      .toEqual({
        feature1: 'state-for-feature1',
        complex: {
          slice: {
            feature3: 'state-for-feature3',
          },
        },
      });
  });
  
  test('some features without state', () => {
    expect(applyAppState([feature1, featureWithoutState, feature2]))
      .toEqual({
        feature1: 'state-for-feature1',
        feature2: 'state-for-feature2',
      });
  });
  
  test('NO state in all features', () => {
    expect(()=>applyAppState([featureWithoutState]))
      .toThrow(/found NO reducers within your features/);
    // throw:  ***ERROR*** feature-redux found NO reducers within your features ... did you forget to register Feature.reducer aspects in your features? (please refer to the feature-redux docs to see how to override this behavior).
  });

  test('NO state in all features OVERRIDING allowNoReducers$=true (using identity reducer)', () => {
    expect(applyAppState([featureWithoutState], true))
      .toBe(undefined);
  });

  test('NO state in all features OVERRIDING allowNoReducers$=myReducerFn', () => {
    expect(applyAppState([featureWithoutState], ()=>'WowZee: I injected myReducerFn'))
      .toBe('WowZee: I injected myReducerFn');
  });
  
  test('Error detected for duplicate slices', () => {
    expect(()=>applyAppState([feature1, feature1]))
      .toThrow(/cannot be specified by multiple features/);
  });
  
  test('Error detected for duplicate intermediate slices', () => {
    expect(()=>applyAppState([feature4, feature3]))
      .toThrow(/cannot be specified by multiple features/);
  });
  
  test('Error detected for duplicate intermediate slices (in any order)', () => {
    expect(()=>applyAppState([feature3, feature4]))
      .toThrow(/cannot be specified by multiple features/);
    // THROW: *** ERROR*** feature-u launchApp() constraint violation: reducer slice: 'complex.slice'
    //                     cannot be specified by multiple features 
    //                     (either as an intermediate node, or an outright duplicate)
    //                     because we can't intermix feature reducers and combineReducer() from launchApp()
  });
  
  test('Expected real-world case', () => {
  
    const manageViews = createFeature({
      name:    'manageViews',
      reducer: slicedReducer('views.curView',
                             (state='default-manageViews', action) => 'state-for-manageViews'),
    });
  
    const eateries = createFeature({
      name:    'eateries',
      reducer: slicedReducer('views.eateries',
                             (state='default-eateries', action) => 'state-for-eateries'),
    });
  
    const discovery = createFeature({
      name:    'discovery',
      reducer: slicedReducer('views.discovery',
                             (state='default-discovery', action) => 'state-for-discovery'),
    });
  
    expect(applyAppState([manageViews, eateries, discovery]))
      .toEqual({
        views: {
          curView:   'state-for-manageViews',
          eateries:  'state-for-eateries',
          discovery: 'state-for-discovery',
        },
      });
  });

  test('Test gobbledy goop', () => {

    const myReducer = (state=null, action) => 'myReducer';

    const featureGobbledyGoop = createFeature({
      name:    'featureGobbledyGoop',
      reducer: slicedReducer('~!@#$ . %^&*()_+{}:;"', myReducer),
    });

    expect(applyAppState([featureGobbledyGoop]))
      .toEqual({
        "~!@#$ ": {
          " %^&*()_+{}:;\"": "myReducer",
        },
      });

  });

  test('Test NO feature reducers', () => {
    expect(()=>applyAppState([]))
      .toThrow(/found NO reducers within your features/);
    // throw:  ***ERROR*** feature-redux found NO reducers within your features ... did you forget to register Feature.reducer aspects in your features? (please refer to the feature-redux docs to see how to override this behavior).
  });

});
