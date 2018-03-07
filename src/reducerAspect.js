import React                   from 'react';           // peerDependency
import {applyMiddleware,
        compose,
        createStore,
        combineReducers}       from 'redux';           // peerDependency
import {Provider}              from 'react-redux';     // peerDependency
import {createAspect,
        launchApp,
        extendAspectProperty}  from 'feature-u';       // peerDependency: 
import slicedReducer           from './slicedReducer';
import isFunction              from 'lodash.isfunction';

// our logger (integrated/activated via feature-u)
const logf = launchApp.diag.logf.newLogger('- ***feature-redux*** reducerAspect: ');

// NOTE: See README for complete description
export default createAspect({
  name: 'reducer', // to fully manage all of redux, we ONLY need the reducers (hence our name)!
  genesis,
  validateFeatureContent,
  expandFeatureContent,
  assembleFeatureContent,
  assembleAspectResources,
  getReduxStore,
  injectRootAppElm,
  config: {
    allowNoReducers$: false, // PUBLIC: client override to: true || [{reducerFn}]
    createReduxStore$,       // HIDDEN: createReduxStore$(appReducer, middlewareArr): appStore
  },
});


/**
 * Register feature-redux proprietary Aspect APIs (required to pass
 * feature-u validation).
 * This must occur early in the life-cycle (i.e. this method) to
 * guarantee the new API is available during feature-u validation.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, feature-u will prefix them
 *       with: 'launchApp() parameter violation: '
 *
 * @return {string} NONE FOR US ... an error message when self is in an invalid state
 * (falsy when valid).
 *
 * @private
 */
function genesis() {
  logf('genesis() registering two new Aspect properties: getReduxStore() -and- getReduxMiddleware()');

  extendAspectProperty('getReduxStore', 'feature-redux');      // Aspect.getReduxStore(): store
  extendAspectProperty('getReduxMiddleware', 'feature-redux'); // Aspect.getReduxMiddleware(): reduxMiddleware
}


/**
 * Validate self's aspect content on supplied feature.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, **feature-u** will prefix them
 *       with: 'createFeature() parameter violation: '
 *
 * @param {Feature} feature - the feature to validate, which is known
 * to contain this aspect.
 *
 * @return {string} an error message when the supplied feature
 * contains invalid content for this aspect (null when valid).
 *
 * @private
 */
function validateFeatureContent(feature) {
  const content = feature[this.name];
  return isFunction(content)
       ? ( content.slice
         ? null
         : `${this.name} (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).`
       )
       : `${this.name} (when supplied) must be a function`;
}


/**
 * Expand the reducer content in the supplied feature -AND- transfer
 * the slice property from the expansion function to the expanded
 * reducer.
 *
 * @param {App} app the App object used in feature
 * cross-communication.
 * 
 * @param {Feature} feature - the feature which is known to contain
 * this aspect **and** is in need of expansion (as defined by
 * managedExpansion()).
 *
 * @return {string} an optional error message when the supplied
 * feature contains invalid content for this aspect (falsy when
 * valid).  This is a specialized validation of the expansion
 * function, over-and-above what is checked in the standard
 * validateFeatureContent() hook.
 *
 * @private
 */
function expandFeatureContent(app, feature) {
  // hold on to our reducer slice
  // ... so as to apply it to our final resolved reducer (below)
  const slice = feature[this.name].slice;

  // insure the slice is defined
  if (!slice) {
    return `${this.name} (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).`;
  }

  // expand self's content in the supplied feature
  // ... by invoking the managedExpansionCB(app) embellished by managedExpansion(managedExpansionCB)
  feature[this.name] = feature[this.name](app);

  // apply same slice to our final resolved reducer
  // ... so it is accessable to our internals (i.e. launchApp)
  slicedReducer(slice, feature[this.name]);

  logf(`expandFeatureContent() successfully expanded Feature.name:${feature.name}'s Feature.${this.name} and applied slicedReducer() from outer managedExpansion()`);
}

/**
 * Interpret the supplied features, generating our top-level app
 * reducer function.
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @private
 */
function assembleFeatureContent(app, activeFeatures) {

  // interpret the supplied features, generating our top-level app reducer function
  // ... our logf() is in the accumAppReducer() surrogate
  const appReducer = accumAppReducer(this.name, activeFeatures, this.config.allowNoReducers$);

  // retain for subsequent usage
  this.appReducer = appReducer;
}


/**
 * Collect any redux middleware from other aspects through OUR
 * documented Aspect.getReduxMiddleware() API (an"aspect
 * cross-communication" mechanism).
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @param {Aspect[]} aspects - The set of **feature-u** Aspect objects
 * used in this this application.
 *
 * @private
 */
function assembleAspectResources(app, aspects) {

  // collect any redux middleware from other aspects through OUR Aspect.getReduxMiddleware() API
  const hookSummary = [];
  const middleware = aspects.reduce( (accum, aspect) => {
    if (aspect.getReduxMiddleware) {
      const reduxMiddleware = aspect.getReduxMiddleware();
      if (reduxMiddleware) {
        hookSummary.push(`\n  Aspect.name:${aspect.name} <-- defines: getReduxMiddleware()`);
        accum.push( reduxMiddleware );
      }
      else {
        hookSummary.push(`\n  Aspect.name:${aspect.name} <-- defines: getReduxMiddleware() ... HOWEVER returned null`);
      }
    }
    else {
      hookSummary.push(`\n  Aspect.name:${aspect.name}`);
    }
    return accum;
  }, []);
  logf(`assembleAspectResources() gathered ReduxMiddleware from the following Aspects: ${hookSummary}`);

  // create our redux store (retained in self for subsequent usage)
  // ... accomplished in internal config micro function (a defensive measure to allow easier overriding by client)
  logf(`assembleAspectResources() defining our Redux store WITH optional middleware registration`);
  this.appStore = this.config.createReduxStore$(this.appReducer, middleware);
}


/**
 * An internal config micro function that creates/returns the redux
 * app store WITH optional middleware regsistration.
 *
 * This logic is broken out in this internal method as a defensive
 * measure to make it easier for a client to override (if needed for
 * some unknown reason).
 *
 * @param {reducerFn} the top-level app reducer function.
 *
 * @param {reduxMiddleware[]} middlewareArr - the optional set of
 * reduxMiddleware items to register to redux (zero length array if
 * none).
 *
 * @return {reduxAppStore} the newly created redux app store.
 *
 * @private
 */
function createReduxStore$(appReducer, middlewareArr) {
  // define our Redux app-wide store WITH optional middleware regsistration
  return  middlewareArr.length === 0
           ? createStore(appReducer)
           : createStore(appReducer,
                         compose(applyMiddleware(...middlewareArr)));
}


/**
 * Promote our redux store (for good measure), just in case some 
 * external process needs it.
 *
 *@throws {Error} when getReduxStore() called before launchApp()
 */
function getReduxStore() {
  if ( ! this.appStore ) {
    throw new Error(`***ERROR*** feature-redux reducerAspect.getReduxStore() can only be called after a successful launchApp() execution`);
  }
  return this.appStore;
}


/**
 * Introduce the standard Redux Provider component in the app root
 * element, providing standard access to the redux store (both state
 * and dispatch) through redux connect().
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {reactElm} curRootAppElm - the current react app element root.
 *
 * @return {reactElm} a new react app element root (which in turn must
 * contain the supplied curRootAppElm), or simply the supplied
 * curRootAppElm (if no change).
 *
 * @private
 */
function injectRootAppElm(app, curRootAppElm) {
  logf(`injectRootAppElm() introducing redux <Provider> component into rootAppElm`);
  return (
    <Provider store={this.appStore}>
      {curRootAppElm}
    </Provider>
  );
  // TODO: if an external "feature" changes curRootAppElm to an array, <Provider> can't handle multiple children
}


/**
 * @private
 *
 * Interpret the supplied features, generating our top-level app
 * reducer function.
 *
 * @param {string} aspectName self's aspect name, used to "key"
 * aspects of this type in the Feature object: `Feature.{name}: xyz`.

 * @param {Feature[]} activeFeatures the "active" features that
 * comprise this application.
 *
 * @param {boolean/function} allowNoReducers$ the 
 * reducerAspect.config.allowNoReducers$ in effect.
 *
 * @return {appReducerFn} a top-level app reducer function.
 */
export function accumAppReducer(aspectName, activeFeatures, allowNoReducers$=null) { // ... named export ONLY used in testing

  // iterated over all activeFeatures,
  // ... generating the "shaped" genesis structure
  //     used in combining all reducers into a top-level app reducer
  //     EXAMPLE:
  //     - given following reducers (each from a seperate Feature):
  //         Feature.reducer: slicedReducer('device',           deviceReducerFn)
  //         Feature.reducer: slicedReducer('auth',             authReducerFn)
  //         Feature.reducer: slicedReducer('view.currentView', currentViewReducerFn)
  //         Feature.reducer: slicedReducer('view.discovery',   discoveryReducerFn)
  //         Feature.reducer: slicedReducer('view.eateries',    eateriesReducerFn)
  //     - the following shapedGenesis will result:
  //         shapedGenesis: {
  //           device:        deviceReducerFn,
  //           auth:          authReducerFn,
  //           view: {
  //             currentView: currentViewReducerFn,
  //             discovery:   discoveryReducerFn,
  //             eateries:    eateriesReducerFn,
  //           }
  //         }
  const shapedGenesis = {};

  // using old style es5 "for loop" in lieu of es6 "for of"
  // ... issue in react-native android JS engine:
  //     ERROR: missing Symbol.iterator: '@@iterator'
  // ... may be related to android JS engine -or- stale babel transpiler
  // ... for now, using es5 "for loop" is path of least resistance
//for (const feature of activeFeatures) {
  for (let i=0; i<activeFeatures.length; i++) {
    const feature = activeFeatures[i];

    // only interpret features that define our aspect
    if (feature[aspectName]) {

      const reducer = feature[aspectName]; // our feature content is a reducer!
      const slice   = reducer.slice;       // our validation ensures embelishment via slicedReducer()

      // interpret the slice's federated namespace into a structure with depth
      const nodeNames    = slice.split('.');
      let   runningNode  = shapedGenesis;
      let   runningShape = '';

      for (let i=0; i<nodeNames.length; i++) { // use old-styled for loop to interpret index (see: leafNode variable)
        const nodeName = nodeNames[i];
        const leafNode = (i === nodeNames.length-1);

        // utilize existing subNode (from other features), or create new (on first occurance)
        const subNodeExisted = (runningNode[nodeName]) ? true : false;
        const subNode        = runningNode[nodeName] || {};

        // maintain human readable shape (for error reporting)
        runningShape += (runningShape?'.':'') + nodeName;

        // apply validation constraints of our shapedGenesis
        // 1: intermediate node cannot be a reducer, because we can't intermix feature reducer with combineReducer (of launchApp)
        // 2: all leafs MUST be reducer functions (this is actually FORCED by our code below)
        if ( isFunction(subNode) || (subNodeExisted && leafNode) ) { // TO BE ORDER INDEPENDENT, added: or condition
          throw new Error(`***ERROR*** feature-redux constraint violation: reducer slice: '${runningShape}' cannot be specified by multiple features (either as an intermediate node, or an outright duplicate) because we can't intermix feature reducers and combineReducer() from launchApp()`);
        }

        // inject our new sub-node -or- the reducer for leaf nodes
        runningNode[nodeName] = leafNode ? reducer : subNode;

        // continue process into next level
        runningNode = subNode;
      }
    }
  }

  // handle scenario where NO reducers were specified in our set of Features
  // ... when shapedGenesis == {}
  const appHasNoState = Object.keys(shapedGenesis).length === 0;
  if (appHasNoState) {
    
    // by default, this is an error condition (when NOT overridden by client)
    if (!allowNoReducers$ ) {
      throw new Error('***ERROR*** feature-redux found NO reducers within your features ' +
                      `... did you forget to register Feature.${aspectName} aspects in your features? ` +
                      '(please refer to the feature-redux docs to see how to override this behavior).');
    }

    // when client override is a function, interpret it as an app-wide reducer
    else if(isFunction(allowNoReducers$)) {
      logf.force(`WARNING: NO reducers were found in your features (i.e. Feature.${aspectName}), ` +
                 'but client override (reducerAspect.config.allowNoReducers$=reducerFn;) ' +
                 'directed a continuation WITH the specified reducer.');
      return allowNoReducers$; // use supplied reducer
    }

    // otherwise we simply use an identity reducer
    else {
      logf.force(`WARNING: NO reducers were found in your features (i.e. Feature.${aspectName}), ` +
                 'but client override (reducerAspect.config.allowNoReducers$=truthy;) ' +
                 'directed a continuation WITH the identity reducer.');
      return (state) => state; // use identity reducer
    }
  }

  // convert our "shaped" genesis structure into a single top-level app reducer function
  logf(`assembleFeatureContent() the overal appState shape is: `, shapedGenesis);
  const appReducer = accumReducer(shapedGenesis);
  return appReducer;
}


/**
 * A recursive function that acumulates all reducers in the supplied
 * genisisNode into a single reducer function.
 *
 * @param {GenisisStruct} genesisNode a "shaped" genesis structure
 * used in combining all reducers.
 *
 * @return {reducerFn} a reducer function that recursivally
 * accumulates all reducers found in the supplied genesisNode.
 *
 * @private
 */
function accumReducer(genesisNode) {

  if (isFunction(genesisNode)) {
    return genesisNode;
  }

  const subReducers = {};
  for (const subGenesisNodeName in genesisNode) {
    const subGenesisNode = genesisNode[subGenesisNodeName];
    subReducers[subGenesisNodeName] = accumReducer(subGenesisNode);
  }

  return combineReducers( subReducers );
}
