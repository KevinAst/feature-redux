import reducerAspect  from './reducerAspect';
import slicedReducer  from './slicedReducer';

//*** 
//*** Promote all feature-redux utilities through a centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { createFeature }    from 'feature-redux';
//       -or-
//         import * as FeatureU from 'feature-redux';
export {
  reducerAspect,
  slicedReducer,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-redux');
//       -or-
//         const FeatureU   = require('feature-redux');
export default {
  reducerAspect,
  slicedReducer,
};

