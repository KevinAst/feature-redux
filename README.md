# feature-redux *(feature-u redux integration)*

**feature-redux** is your **feature-u** integration point to [redux]!
It promotes the `reducerAspect` _(a **feature-u** plugin)_ that
facilitates [redux] integration to your features.

**Backdrop:**

<div style="margin-left: 2em;">

**feature-u** is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your
project by individual features.  **feature-u** is extendable. It
operates under an open plugin architecture where Aspects integrate
feature-u to other framework/utilities that match your specific
run-time stack.

</div>

<!--- ?? TODO: DOC AI: update ALL links ---> 

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

<div style="margin-left: 2em;">

**feature-redux** configures [redux] through the `reducerAspect`
(_which is supplied to_ **feature-u**'s [`launchApp()`]).  This
extends **feature-u**'s `Feature` object by adding support for the
`Feature.reducer` property, referencing feature-based reducers.

A feature-based reducer is simply a normal reducer that manages the
feature's slice of the the overall appState.  The only thing different
is it must be embellished with [`slicedReducer()`], which provides
instructions on where to insert it in the overall top-level appState.

Only reducers are of interest to **feature-redux** because that is
what is needed to configure [redux].  All other redux items (_actions,
selectors, etc._) are internal implementation details of the feature.

It is important to understand that you continue to use [redux] the
same way you always have.  It's just that now you are dealing with a
smaller context ... within the boundaries of your feature!

As an aside, because **feature-redux** manages redux, it also
provides an integration point to other Aspects that need to inject
their redux middleware.

</div>

Let's see how this all works together ...


## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  - [Actions](#actions)
    - [Public Actions](#public-actions)
    - [Action Uniqueness](#action-uniqueness)
  - [Reducers (state)](#reducers-state)
    - [Sliced Reducers](#sliced-reducers)
  - [Selectors (encapsulating state)](#selectors-encapsulating-state)
    - [Public Selectors](#public-selectors)
    - [Feature State Location (Single Source of Truth)](#feature-state-location-single-source-of-truth)
- [Interface Points](#interface-points)
  - [Inputs](#inputs)
  - [Exposure](#exposure)
- [API](#api)
  - [`reducerAspect: Aspect`](#reduceraspect-aspect)
  - [`slicedReducer(slice, reducer): reducerFn`](#slicedreducer)


## Install

- **peerDependencies** ... you should already have these, **because
  this is our integration point** _(but just in case)_:

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

1. Within your mainline, register the **feature-redux**
   `reducerAspect` to **feature-u**'s [`launchApp()`] _(see: `**1**`
   below)_.

   **src/app.js**
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

2. Within each feature that maintains state, simply register the
   feature's reducer through the `Feature.reducer` property _(using
   **feature-u**'s `createFeature()`)_ ... _see: `**2**` below_.

   Because the state of each feature is combined into one overall
   appState, the feature reducer must identify it's root location,
   through the [`slicedReducer()`] function.  This **slice** can
   optionally reference a federated namespace corresponding to the
   desired target shape.

   **src/feature/myXyzFeature/index.js**
   ```js
   import {createFeature}  from 'feature-u';
   import {slicedReducer}  from 'feature-redux';
   import myXyzFeatureReducer from './state';
   
   export default createFeature({

     name:     'myXyzFeature',

     reducer:  slicedReducer('my.feature.state.location', myXyzFeatureReducer), // **2**

     ... snip snip (other aspect properties here)
   });
   ```

**Well that was easy!!** At this point **redux** is **completely setup
for your application!** The [redux store] has been created and is
accessible through the standard redux [`connect()`] function.

In the nutshell, that's a highlight of most everything you need to know to use
**feature-redux**!  _Go forth and compute!_


## A Closer Look

feature-redux automatically configures redux by creating the store
_(accumulating feature reducers across your app)_, and making the
store available through the standard redux [`connect()`] function,
_(by injecting the standard redux `<Provider>` component at the root
of your app)_.

It is important to understand that your interface to redux has not
changed in any way.  In other words, you continue to use [redux] the
same way you always have.  It's just that now you are dealing with a
smaller context ... within the boundaries of your feature!

With that said, as always, you should strive to keep each feature
isolated, so it is truly plug-and-play.
Working with [redux], involves interacting with [actions],
[reducers], and [selectors].  Let's take a closer look at some
**Feature-Based Best Practices** in regard to redux usage.

### Actions

Within the [redux] framework, [actions] are the basic building blocks
that facilitate application activity.

- Actions follow a pre-defined convention that promote an action type
  and a type-specific payload.

- Actions are dispatched throughout the system (both UI components,
  and logic modules).

- Actions are monitored by reducers (which in turn change state), and
  trigger UI changes.

- Actions can also be monitored by logic modules _(when using
  [redux-logic])_, that implement a variety of app-level logic
  ... things like asynchronously gathering server resources, and even
  dispatching other actions.

In general, **actions are considered to be an internal detail of the
feature**, and therefore are **NOT managed by feature-u**.  In other
words, *each feature will define and use it's own set of actions*.

This allows you to manage your actions however you wish.  Best
practices prescribe that actions be created by [action
creators](https://redux.js.org/docs/basics/Actions.html#action-creators)
(functions that return actions).  It is common to manage your action
creators and action types through a library like [action-u] or
[redux-actions].

#### Public Actions

<div style="margin-left: 2em;">

There are a small number of cases where feature-based actions may need
to be promoted outside of a feature's boundry.  Say, for example,
featureA's reducer needs to monitor one of featureB's actions, or one
of featureB's logic modules needs to dispatch a featureA action.

When this happens **the [publicFace](#publicface) feature-u aspect
can be used for this promotion**.

Please note that in consideration of feature encapsulation, *best
practices would strive to minimize the public promotion of actions
outside the feature boundary*.

</div>

#### Action Uniqueness

<div style="margin-left: 2em;">

One characteristic that actions must adhere to is: **action types must
be unique across the entire app**, *because they are interpreted at an
app-level scope*.

This uniqueness is the responsibility of your implementation, because
**feature-u** is not involved.  This may simply naturally happen in
your implementation.  

If however, you wish to systematically insure this uniqueness, the
simplest thing to do is to **prefix all your action types with the
feature name** (*feature-u guarantees all feature names are unique*).
This has the *added benefit of readily associating dispatched action
flows to the feature they belong to*.

**Note**: Ideally you could use the `Feature.name` as the
single-source-of-truth, however importing feature from your action
modules is problematic _(the Feature object will most likely not be
fully resolved during in-line code expansion)_.  As a result, a **best
practice** is to import a seperate `featureName` constant (*that
simply holds the name*).  Here is an example using [action-u] (_see:
`**1**` below_):

**src/feature/featureA/featureName.js**
```js
export default 'featureA'; // **1**
```

**src/feature/featureA/actions.js**
```js
import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // **1** prefix all actions with our feature name, guaranteeing uniqueness app-wide!
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

This example results in actions of type:
- `featureA.action1`
- `featureA.action2`

</div>

### Reducers (state)

Within the [redux] framework, [reducers] monitor actions, changing
appState, which in turn triggers UI changes.

Each feature (that maintains state), defines it's own reducer,
maintaining it's slice of the overall appState.

While these reducers are truly opaque assets _(internal to the
feature)_, they are of interest to **feature-redux** to the extent
that they are needed to configure redux.

Each feature that maintains state, simply registers it's reducer
through the `Feature.reducer` property _(using **feature-u**'s
`createFeature()`)_.  

Because reducers may require access to **feature-u**'s App object
during code expansion, this property can also be a **feature-u**
`managedExpansion()` callback _(a function that returns the reducer)_
... please refer to **feature-u**'s discussion of [Managed Code
Expansion].

#### Sliced Reducers

<div style="margin-left: 2em;">

Because **feature-redux** must combine the reducers from all features
into one overall appState, it requires that each reducer be
embellished through the [`slicedReducer()`] function.  

This merely injects a slice property on the reducer function
_(interpreted by **feature-redux**)_, specifying the location of the
reducer within the top-level appState tree.

This **slice** can optionally reference a federated namespace
corresponding to the desired target shape.

As an example, consider the following definition: 

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

Which yields the following overall appState:

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

</div>


### Selectors (encapsulating state)

[Selectors] are a redux best practice which encapsulates both the
state shape location and the business logic interpretation of that
state.

Selectors should be used to encapsulate all your state.  Most
selectors are promoted/used internally within the feature _(defined in
close proximity to your reducers)_.


#### Public Selectors

<div style="margin-left: 2em;">

While **feature-u** does not directly manage anything about selectors, a
feature may wish to promote some of it's selectors using the
[publicFace](#publicface) **feature-u** aspect.  

Please note that in consideration of feature encapsulation, *best
practices would strive to minimize the public promotion of feature
state (and selectors) outside the feature boundary*.

</div>


#### Feature State Location (Single Source of Truth)

<div style="margin-left: 2em;">

Another benefit of [`slicedReducer()`] is that not only does it
embellish the reducer with a `slice` property _(interpreted by
**feature-redux**)_, it also injects a selector that returns the
slicedState root, given the appState:

```js
reducer.getSlicedState(appState): slicedState
```

In our case the slicedState is one in the same as the featureState, so
as a **best practice** it can be used in all your selectors to further
encapsulate this detail (**employing another single-source-of-truth
principle**).

Here is an example _(see: `**1**` and `**2**`)_:


```js
                             // **1** DEFINITION
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState);

                             // **2** USAGE
                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```

</div>


## Interface Points

The primary accomplishment of **feature-redux** is the creation (_and
configuration_) of the [redux store].  The **Aspect Interface** to
this process (_i.e. the inputs and outputs_) are documented here.

### Inputs

1. **Primary Input**:

   The primary input to **feature-redux** is the set of [reducers]
   that make up the overall app reducer.  This is specified by each of
   your features (_that maintain state_) through the `Feature.reducer`
   property, containing a [`slicedReducer()`] that
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
   [`<Provider>`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)
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
   through the `Aspect.getReduxStore()` method.  This provides direct
   access to the store to any external process that needs it.


## API

### reducerAspect: Aspect

<div style="margin-left: 2em;">

The `reducerAspect` is the **feature-u** plugin that facilitates
[redux] integration to your features.

To use this aspect:

1. Within your mainline, register the **feature-redux**
   `reducerAspect` to **feature-u**'s [`launchApp()`].

2. Within each feature that maintains state, simply register the
   feature's reducer through the `Feature.reducer` property _(using
   **feature-u**'s `createFeature()`)_.

   Because the state of each feature is combined into one overall
   appState, the feature reducer must identify it's root location,
   through the [`slicedReducer()`] function.  This **slice** can
   optionally reference a federated namespace corresponding to the
   desired target shape.

</div>


### slicedReducer()

<section style="margin-left: 2em;">

**API:** `slicedReducer(slice, reducer): reducer`

Embellish the supplied reducer with a slice property - a
specification (interpreted by **feature-redux**) as to the
location of the reducer within the top-level appState tree.

Please refer to the [Sliced Reducers](#sliced-reducers) section for a
complete description with examples.

**Note:** [`slicedReducer()`] should always wrap the the outer
function passed to `createFeature()`, even when `managedExpansion()`
is used.  This gives your app code access to the embellished
`getSlicedState()` selector, even prior to expansion occurring (_used
as a single-source-of-truth in your selector definitions_).


**Parameters**:

- **slice**: string

  The location of the managed state within the overall top-level
  appState tree.  This can be a federated namespace _(delimited by
  dots)_.  Example: `'views.currentView'`

- **reducer**: reducerFn

  The redux reducer function to be embellished with the slice
  specification.

**Return**: reducerFn

<section style="margin-left: 2em;">

the supplied reducer, embellished with both the slice and a
convenience selector:

```js
reducer.slice: slice
reducer.getSlicedState(appState): slicedState
```
</section>

</section>



<!--- ?? USING NOW ---> 
[redux store]:      https://redux.js.org/docs/api/Store.html
[`connect()`]:      https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options

[`launchApp()`]:    https://feature-u.js.org/cur/api.html#launchApp

[`slicedReducer()`]: #slicedreducer



[Managed Code Expansion]: https://feature-u.js.org/cur/crossCommunication.html#managed-code-expansion



<!--- ?? UNSURE if being used ---> 


[action-u]:         https://www.npmjs.com/package/action-u
[actions]:          https://redux.js.org/docs/basics/Actions.html
[reducers]:         https://redux.js.org/docs/basics/Reducers.html
[redux-actions]:    https://www.npmjs.com/package/redux-actions
[redux]:            http://redux.js.org/
[redux middleware]: https://redux.js.org/docs/advanced/Middleware.html
[selectors]:        https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170

