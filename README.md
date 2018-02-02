# feature-redux *(feature-u redux integration)*

**feature-redux** promotes the `reducerAspect` (a **feature-u**
plugin) that facilitates [redux] integration in your features.

**SideBar:**
<ul>

**feature-u** is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your
project by individual features.  **feature-u** is extendable. It
operates under an open plugin architecture where Aspects integrate
feature-u to other framework/utilities that match your specific
run-time stack.

**feature-redux** is your **feature-u** integration point to [redux]!

</ul>

?? TODO: DOC AI: insure feature-u links are valid ONCE feature-u docs have stabilized!
?? TODO: DOC AI: insure ALL links are valid

TODO: Badges Here
<!--- Badges for CI Builds
?? retrofit this from action-u
[![Build Status](https://travis-ci.org/KevinAst/action-u.svg?branch=master)](https://travis-ci.org/KevinAst/action-u)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ab82e305bb24440281337ca3a1a732c0)](https://www.codacy.com/app/KevinAst/action-u?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=KevinAst/action-u&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/ab82e305bb24440281337ca3a1a732c0)](https://www.codacy.com/app/KevinAst/action-u?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=KevinAst/action-u&amp;utm_campaign=Badge_Coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/kevinast/action-u/badge.svg)](https://snyk.io/test/github/kevinast/action-u)
[![NPM Version Badge](https://img.shields.io/npm/v/action-u.svg)](https://www.npmjs.com/package/action-u)
---> 


**Overview:**

<ul>

**feature-redux** configures [redux] through the `reducerAspect`
(_to be supplied to_ [`launchApp()`]), which extends the Feature object,
adding support for the `Feature.reducer` property, referencing
feature-based reducers.

Only reducers are of interest because that is all that is needed to
configure [redux].  All other redux items (_actions, selectors, etc._)
are considered to be an internal implementation detail of the feature.

The `Feature.reducer` content must be embellished by
`slicedReducer()`, which provides instructions on how to combine
multiple feature-based reducers in constructing the overall top-level
application state tree.

Because **feature-redux** manages redux, it also provides an
integration point to other Aspects that need to inject redux
middleware.

Additional information can be found in the following sections.

</ul>

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  * [Actions](#actions)
  * [Reducers (state)](#reducers-state)
    - [Sliced Reducers](#sliced-reducers)
  * [Selectors (encapsulating state)](#selectors-encapsulating-state)
    - [Single Source of Truth (Feature State Location)](#single-source-of-truth-feature-state-location)
- [Interface Points](#interface-points)
  * [Inputs](#inputs)
  * [Exposure](#exposure)
- [API](api.md)
  * [`reducerAspect`](api.md#reducerAspect)
  * [`slicedReducer(slice, reducer): reducerFn`](api.md#slicedReducer)

## Install

- **peerDependencies** ... your should already have these, because
  **this is our integration point** _(but just in case)_:

  ```shell
  npm install --save react
  npm install --save redux
  npm install --save react-redux
  ```
  <!--- WITH REVEAL of USAGE:
  npm install --save react        # USAGE: inject <Provider> component
  npm install --save redux        # USAGE: applyMiddleware(), combineReducers(), compose(), createStore()
  npm install --save react-redux  # USAGE: <Provider> component
  ---> 

- **the main event**:

  ```shell
  npm install --save feature-redux
  ```

## Usage

1. Register the **feature-redux** `reducerAspect` through
   **feature-u**'s [`launchApp()`] _(see: `**1**` below)_.

   **myAppMain.js**
   ```js
   import {launchApp}      from 'feature-u';
   import {reducerAspect}  from 'feature-redux'; // **1**
   import features         from './feature';

   export default launchApp({

     aspects: [
       reducerAspect,                            // **1**
       ... other Aspects here
     ],

     features,

     registerRootAppElm(rootAppElm) {
       ReactDOM.render(rootAppElm,
                       getElementById('myAppRoot'));
     }
   });
   ```

2. Simply specify a `Feature.reducer` in any of your features that
   maintain state _(using `createFeature()`)_.  This references the
   reducer function that maintains the feature's state _(see: `**2**`
   below)_.

   Because each feature state is combined into one overall appState
   _including all features)_ the reducer must identify it's root
   location, through the `slicedReducer()` function.

   **myXyzFeature.js**
   ```js
   import {createFeature}  from 'feature-u';
   import {slicedReducer}  from 'feature-redux';
   import myXyzFeatureReducer from './state';
   
   export default createFeature({
     name:     'myXyzFeature',
     reducer:  slicedReducer('my.feature.state.location', myXyzFeatureReducer), // **1**
     ... other aspect properties here
   });
   ```

At this point **redux** is **completely setup for your application!**
The [redux store] has been created and is accessible through the
standard redux [`connect()`] function.  **That was easy!!**

In the nutshell, that's most everything you need to know to use
**feature-redux**!  _Go forth and compute!_


## A Closer Look

In working with the [redux] framework, you deal with [actions],
[reducers], and [selectors].

**feature-redux** is only concerned with the characteristics of
redux that are required to configure it (_a generalized principle of
all **feature-u** Aspects_).  As a result, **feature-redux** is only
interested in your reducers, because that is what it needs to
configure redux.  All other redux items are considered internal
details of your feature code.

It is important to note that even though your using
**feature-redux**, your interface to redux does not change in any
way.  In other words, your code continues to operate with redux as it
always has.

With that said, there are some feature-based best practices that you
should strive to achieve.  As an example, you should strive to keep
each feature isolated, so it is truly plug-and-play.

Let's take a closer look at some basic redux concepts, highlighting
several feature-based items of interest.


### Actions

Within the [redux] framework, [actions] are the basic building blocks
that facilitate application activity.

- Actions follow a pre-defined convention that promote an action type
  and a type-specific payload.

- Actions are dispatched throughout the system (both UI components,
  and logic modules).

- Actions are monitored by reducers (which in turn change state), and
  trigger UI changes.

- Actions are also monitored by logic modules, implementing a variety
  of app-level logic (things like asynchronously gathering server
  resources, and even dispatching other actions).

In general, **actions are considered to be an internal detail of the
feature**, and therefore are **NOT managed by feature-u**.  In other
words, *each feature will define and use it's own set of actions*.

This allows you to manage your actions however you wish.  Best
practices prescribe that actions be created by [action
creators](https://redux.js.org/docs/basics/Actions.html#action-creators)
(functions that return actions).  It is common to manage your action
creators and action types through a library like [action-u] or
[redux-actions].

With that said, **there are cases where actions need to be promoted
outside of a feature's implementation**.  Say, for example, featureA's
reducer needs to monitor one of featureB's actions, or one of
featureB's logic module needs to dispatch a featureA action.  When
this happens **the [publicFace](#publicface) **feature-u** aspect can be
used for this promotion**.  Please note that in consideration of
feature encapsulation, *best practices would strive to minimize the
public promotion of actions outside the feature boundary*.

In regard to actions, one characteristic that must be adhered to is
**action types must to be unique across the entire app**, *because
they are interpreted at an app-level scope*.  This uniqueness is the
responsibility of your implementation, because **feature-u** does not
inject itself in the action definition process.  This may simply
naturally happen in your implementation.  If however, you wish to
systematically insure this uniqueness, the simplest thing to do is to
**prefix all your action types with the feature name** (*feature-u
guarantees all feature names are unique*).  This has the *added
benefit of readily associating dispatched action flows to the feature
they belong to*.  **Note**: Ideally you could use the feature.name as
a single-source-of-truth, however importing feature from your actions
module is problematic (due to the inner dependency of actions with
other feature aspects).  As a result, you can either duplicate the
name in your action root, or import a separate `featureName` module
(*that simply holds the name*).  Here is an example using
[action-u] (_see: **NOTE** below_):

**`src/feature/featureA/featureName.js`**
```js
export default 'featureA'; // *** NOTE ***
```

**`src/feature/featureA/actions.js`**
```js
import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // *** NOTE *** prefix all actions with our feature name, guaranteeing they unique app-wide!
    action1: {     // actions.action1(): Action
                   actionMeta: {},
    },
    action2: {     // actions.action2(): Action
                   actionMeta: {},
    },
    etc...
  },
});
```


### Reducers (state)

Within the [redux] framework, [reducers] monitor actions, changing app
state, which in turn triggers UI changes.

Each feature (that maintains state), will define it's own reducer,
maintaining it's own feature-based state (typically a sub-tree of
several items).

While these reducers are opaque assets that maintain state as an
internal detail of the feature, **feature-redux** is interested in
them to the extent that it must combine all feature states into one
overall appState, and in turn register them to redux.

Each feature (that maintains state) **promotes it's own reducer
through the `reducer` createFeature() parameter**.

Because reducers may require feature-based context information, **this
parameter can also be a managedExpansionCB** - *a function that
returns the reducerFn* (please refer to
[managedExpansion()](#managedexpansion) for more information).


#### Sliced Reducers

Because **feature-redux** must combine the reducers from all
features into one overall appState, it requires that each reducer be
embellished through the `slicedReducer()` function.  This merely
injects a slice property (interpreted by **feature-redux**) on the
reducer function, specifying the location of the reducer within the
top-level appState tree.

As an example, the following definition: 

```js
const currentView = createFeature({
  name:     'currentView',
  reducer:  slicedReducer('view.currentView', currentViewReducer), // *** NOTE ***
  ...
});

const fooBar = createFeature({
  name:     'fooBar',
  reducer:  slicedReducer('view.fooBar', fooBarReducer),           // *** NOTE ***
  ...
});
```

Yields the following overall appState:

```js
appState: {
  view: {
    currentView {
      ... state managed by currentViewReducer
    },
    fooBar: {
      ... state managed by fooBarReducer
    },
  },
}
```


### Selectors (encapsulating state)

[Selectors] are a best practice which encapsulates the raw nature of
the state shape and business logic interpretation of that state.

Selectors are used to encapsulate all your state.  Most
selectors are promoted/used internally within the feature
(defined in close proximity to your reducers).

While **feature-u** does not directly manage anything about selectors, a
feature may wish to promote some of it's selectors using the
[publicFace](#publicface) **feature-u** aspect.  Please note that in
consideration of feature encapsulation, *best practices would strive
to minimize the public promotion of feature state (and selectors)
outside the feature boundary*.


#### Single Source of Truth (Feature State Location)

Another benefit of `slicedReducer()` is that not only does it
embellish the reducer with a `slice` property (interpreted by
**feature-redux**), it also injects a selector that returns the
slicedState root, given the appState:

```js
reducer.getSlicedState(appState): slicedState
```

In our case this slicedState root is one in the same as your
featureState root, so **as a best practice** it can be used in all
your selectors to further encapsulate this detail (**employing a
single-source-of-truth concept**).

Here is an example:

```js
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState); // *** NOTE ***

                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```


## Interface Points

The primary accomplishment of **feature-redux** is the creation (_and
configuration_) of the [redux store].  The **Aspect Interface** to
this process (_i.e. the inputs and outputs_) are documented here.

### Inputs

1. **Primary Input**:

   The primary input to **feature-redux** is the set of [reducers]
   that make up the overall app reducer.  This is specified by each of
   your features (_that maintain state_) through the `Feature.reducer`
   property, containing a [`slicedReducer`](api.md#slicedReducer) that
   manages the state of that corresponding feature.

2. **Middleware Integration**:

   Because **feature-redux** manages [redux], other Aspects can
   promote their [redux middleware] through **feature-redux**'s
   `Aspect.getReduxMiddleware()` API (an "aspect cross-communication
   mechanism").  As an example, the **feature-redux-logic** Aspect
   integrates **redux-logic**.


### Exposure

1. **Primary Output**:

   The primary way in which **feature-redux** exposes [redux] to your
   app is by injecting the standard redux
   [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)
   component at the root of your application DOM.  This enables app
   component access to the [redux store] (along with it's `dispatch()`
   and `getState()`) through the standard redux [`connect()`]
   function.

2. **Middleware Features**:

   Because **feature-redux** allows other aspects to inject their
   [redux middleware], whatever that middleware exposes is made
   available.  As an example, the **feature-redux-logic** Aspect
   injects **redux-logic**.
   
3. **Other**:

   For good measure, **feature-redux** promotes the [redux store]
   through the `Aspect.getReduxStore()` method (once again, an "aspect
   cross-communication mechanism").  While this may be considered
   somewhat unconventional, it is available should an external process
   need it.


## API

  * [`reducerAspect`](api.md#reducerAspect)
  * [`slicedReducer(slice, reducer): reducerFn`](api.md#slicedReducer)




<!--- ?? USING NOW ---> 
[redux store]:      https://redux.js.org/docs/api/Store.html
[`connect()`]:      https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

[`launchApp()`]:    https://feature-u.js.org/cur/api.html#launchApp



<!--- ?? UNSURE if being used ---> 


[action-u]:         https://www.npmjs.com/package/action-u
[actions]:          https://redux.js.org/docs/basics/Actions.html
[reducers]:         https://redux.js.org/docs/basics/Reducers.html
[redux-actions]:    https://www.npmjs.com/package/redux-actions
[redux]:            http://redux.js.org/
[redux middleware]: https://redux.js.org/docs/advanced/Middleware.html
[selectors]:        https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170

