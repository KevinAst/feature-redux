import verify         from './util/verify';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';

// NOTE: See README for complete description
export default function slicedReducer(slice, reducer) {

  // validate parameters
  const check = verify.prefix('slicedReducer() parameter violation: ');

  check(slice,            'slice is required');
  check(isString(slice),  'slice must be a string');

  check(reducer,             'reducer is required');
  check(isFunction(reducer), 'reducer must be a function');

  // auto generate a standard selector for our sliced state
  const nodeNames = slice.split('.');
  function getSlicedState(appState) {
    // console.log(`xx in selector getSlicedState(): `, {nodeNames, appState});
    return nodeNames.reduce( (runningNode, nodeName) => runningNode[nodeName], appState );
  }

  // embellish/return the supplied reducer
  reducer.slice          = slice;
  reducer.getSlicedState = getSlicedState;
  return reducer;
}
