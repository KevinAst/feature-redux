# feature-redux *(feature-u redux integration)*

**feature-redux** is your [feature-u] integration point to [redux]!
It promotes the [`reducerAspect`] _(a [feature-u] plugin)_ that
facilitates [redux] integration to your features.

**Backdrop:**

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

[feature-u] is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your
project by individual features.  [feature-u] is extendable. It
operates under an open plugin architecture where Aspects integrate
**feature-u** to other framework/utilities that match your specific
run-time stack.

</ul>


<!--- Badges for CI Builds ---> 
[![Build Status](https://travis-ci.org/KevinAst/feature-redux.svg?branch=master)](https://travis-ci.org/KevinAst/feature-redux)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9c93a52aa6b6484ebd382ac976176836)](https://www.codacy.com/app/KevinAst/feature-redux?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=KevinAst/feature-redux&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9c93a52aa6b6484ebd382ac976176836)](https://www.codacy.com/app/KevinAst/feature-redux?utm_source=github.com&utm_medium=referral&utm_content=KevinAst/feature-redux&utm_campaign=Badge_Coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/kevinast/feature-redux/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kevinast/feature-redux?targetFile=package.json)
[![NPM Version Badge](https://img.shields.io/npm/v/feature-redux.svg)](https://www.npmjs.com/package/feature-redux)


**Overview:**

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

**feature-redux** configures [redux] through the [`reducerAspect`]
(_which is supplied to_ **feature-u**'s [`launchApp()`]).  This
extends **feature-u**'s [`Feature`] object by adding support for the
`Feature.reducer` property, referencing feature-based [reducers].

A feature-based reducer is simply a normal reducer that manages the
feature's slice of the the overall appState.  The only thing different
is it must be embellished with [`slicedReducer()`], which provides
instructions on where to insert it in the overall top-level appState.

Only [reducers] are of interest to **feature-redux** because that is
what is needed to configure [redux].  All other **redux** items (_[actions],
[selectors], etc._) are internal implementation details of the feature.

It is important to understand that you continue to use [redux] the
same way you always have.  It's just that now you are dealing with a
**smaller context** ... _within the boundaries of your feature_!

As an aside, because **feature-redux** manages redux, it also
provides an integration point to other Aspects that need to inject
their [redux middleware].

</ul>

Let's see how this all works together ...


## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  - [Actions](#actions)
    - [Public Actions](#public-actions)
    - [Action Uniqueness (Single Source of Truth)](#action-uniqueness-single-source-of-truth)
  - [Reducers (state)](#reducers-state)
    - [Sliced Reducers]
    - [State Root (Single Source of Truth)](#state-root-single-source-of-truth)
  - [Selectors (encapsulating state)](#selectors-encapsulating-state)
    - [Public Selectors](#public-selectors)
    - [Feature State Location (Single Source of Truth)](#feature-state-location-single-source-of-truth)
- [Interface Points](#interface-points)
  - [Inputs](#inputs)
  - [Exposure](#exposure)
  - [Error Conditions](#error-conditions)
- [API](#api)
  - [`reducerAspect: Aspect`](#reduceraspect-aspect)
  - [`slicedReducer(slice, reducer): reducerFn`](#slicedreducer)
- [Potential Need for Polyfills](#potential-need-for-polyfills)


## Install

- **peerDependencies** ... you should already have these, **because
  this is our integration point** _(but just in case)_:

  ```shell
  npm install --save feature-u
  npm install --save react
  npm install --save redux
  npm install --save react-redux
  ```
  <!--- WITH REVEAL of USAGE:
  npm install --save feature-u    # VER: >=1.0.0   USAGE: createAspect(), extendAspectProperty() (v1 replaces App with Fassets obj -AND- publicFace with fassets aspect)
  npm install --save react        # VER: >=0.14.0  USAGE: inject <Provider> component
  npm install --save redux        # VER: >=3.1.0   USAGE: applyMiddleware(), combineReducers(), compose(), createStore()
  npm install --save react-redux  # VER: >=1.0.0   USAGE: <Provider> component
  ---> 

- **the main event**:

  ```shell
  npm install --save feature-redux
  ```

**SideBar**: Depending on how current your target browser is
_(i.e. it's JavaScript engine)_, you may need to polyfill your app
_(please refer to [Potential Need for
Polyfills](#potential-need-for-polyfills))_.


## Usage

1. Within your mainline, register the **feature-redux**
   [`reducerAspect`] to **feature-u**'s [`launchApp()`] _(see: `**1**`
   below)_.

   **src/app.js**
   ```js
   import {launchApp}           from 'feature-u';
   import {createReducerAspect} from 'feature-redux'; // **1**
   import features              from './feature';

   export default launchApp({

     aspects: [
       createReducerAspect(),                         // **1**
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
   **feature-u**'s [`createFeature()`])_ ... _see: `**2**` below_.

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
accessible through the standard **redux** [`connect()`] function.

In the nutshell, that's a highlight of most everything you need to know to use
**feature-redux**!  _Go forth and compute!_


## A Closer Look

**feature-redux** automatically configures [redux] by creating the [store]
_(accumulating feature [reducers] across your app)_, and making the
[store] available through the standard **redux** [`connect()`] function,
_(by injecting the standard **redux** [`<Provider>`] component at the root
of your app)_.

It is important to understand that your interface to [redux] has not
changed in any way.  In other words, you continue to use [redux] the
same way you always have.  It's just that now you are dealing with a
**smaller context** ... _within the boundaries of your feature_!

With that said, as always, you should strive to keep each feature
isolated, so it is truly **plug-and-play**.
Working with [redux], involves interacting with [actions],
[reducers], and [selectors].  Let's take a closer look at some
**Feature-Based Best Practices** in regard to [redux] usage.

### Actions

Within the [redux] framework, [actions] are the basic building blocks
that facilitate application activity.

- Actions follow a pre-defined convention that promote an action type
  and a type-specific payload.

- Actions are dispatched throughout the system (both UI components,
  and logic modules).

- Actions are monitored by [reducers] (which in turn change state), and
  trigger UI changes.

- Actions can also be monitored by logic modules _(when using
  [redux-logic])_, that implement a variety of app-level logic
  ... things like asynchronously gathering server resources, and even
  dispatching other actions.

In general, **[actions] are considered to be an internal detail of the
feature**, and therefore are **NOT managed by feature-u**.  In other
words, *each feature will define and use it's own set of [actions]*.

This allows you to manage your actions however you wish.  Best
practices prescribe that actions be created by [action creators]
_(functions that return actions)_.  It is common to manage your action
creators and action types through a library like [action-u] or
[redux-actions].

#### Public Actions

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

There are a small number of cases where feature-based actions may need
to be promoted outside of a feature's boundary.  Say, for example,
featureA's reducer needs to monitor one of featureB's actions, or one
of featureB's logic modules needs to dispatch a featureA action.

When this happens the **feature-u** [`fassets aspect`] can be used for
this promotion.

Please note that in consideration of feature encapsulation, *best
practices would strive to minimize the public promotion of actions
outside the feature boundary*.

</ul>

#### Action Uniqueness (Single Source of Truth)

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

One characteristic that [actions] must adhere to is: **action types must
be unique across the entire app**, *because they are interpreted at an
app-level scope*.

This uniqueness is the responsibility of your implementation, because
[feature-u] is not involved.  This may simply naturally happen in
your implementation.  

If however, you wish to systematically insure this uniqueness, the
simplest thing to do is to **prefix all your action types with the
feature name** _(**feature-u** guarantees all feature names are unique)_.
This has the *added benefit of readily associating dispatched action
flows to the feature they belong to*.

**Note**: Ideally you could use the `Feature.name` as the
single-source-of-truth, however importing feature from your action
modules is problematic _(the [`Feature`] object will most likely not be
fully resolved during in-line code expansion)_.  As a result, a **best
practice** is to import a separate `featureName` constant (*that
simply holds the name*).  Here is an example:

**src/feature/timer/featureName.js**
```js
export default 'timer';
```

**src/feature/timer/actions.js**
```js
import featureName  from './featureName';

// action type constants
export const TIMER_START  = `${featureName}.TIMER_START`;
export const TIMER_CANCEL = `${featureName}.TIMER_CANCEL`;
export const TIMER_RESET  = `${featureName}.TIMER_RESET`;
export const TIMER_END    = `${featureName}.TIMER_END`;

... snip snip
```

</ul>

### Reducers (state)

Within the [redux] framework, [reducers] monitor [actions], changing
appState, which in turn triggers UI changes.

Each feature (that maintains state), defines it's own reducer,
maintaining it's slice of the overall appState.

While these [reducers] are truly opaque assets _(internal to the
feature)_, they are of interest to **feature-redux** to the extent
that they are needed to configure redux.

Each feature that maintains state, simply registers it's reducer
through the `Feature.reducer` property _(using **feature-u**'s
[`createFeature()`])_.  

Because [reducers] may require access to **feature-u**'s [`Fassets
object`] during code expansion, this property can also be a
**feature-u** [`expandWithFassets()`] callback _(a function that
returns the reducer)_ ... please refer to **feature-u**'s discussion
of [Managed Code Expansion].

#### Sliced Reducers

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

Because **feature-redux** must combine the [reducers] from all features
into one overall appState, it requires that each reducer be
embellished through the [`slicedReducer()`] function.  

This merely injects a slice property on the reducer function
_(interpreted by **feature-redux**)_, specifying the location of the
reducer within the top-level appState tree.

This **slice** can optionally reference a federated namespace
corresponding to the desired target shape.

As an example, consider the following definition _(see: `**4**`)_:

```js
const currentView = createFeature({
  name:     'currentView',
  reducer:  slicedReducer('view.currentView', currentViewReducer), // **4**
  ...
});

const fooBar = createFeature({
  name:     'fooBar',
  reducer:  slicedReducer('view.fooBar', fooBarReducer),           // **4**
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

</ul>


#### State Root (Single Source of Truth)

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

You are free to use any root location for your feature's state
(i.e. the slice).  In many cases, this is dictated by the overall
state shape.

However, depending on the context, it is often useful to use the
`featureName` somewhere within this definition.  This **best
practice** has the added benefit of readily associating each slice of
state to the feature they belong to.

We can refine the example above, by programmatically injecting the
`featureName`.  This yields the same result as before, but benefits
from the **single-source-of-truth** principle.

```js
import featureName from './featureName';
import reducer     from './reducer';

const currentView = createFeature({
  name:     featureName,
  reducer:  slicedReducer(`view.${featureName}`, reducer),
  ...
});
```

</ul>



### Selectors (encapsulating state)

[Selectors] are a [redux] best practice which encapsulates both the
state shape location and the business logic interpretation of that
state.

Selectors should be used to encapsulate all your state.  Most
selectors are promoted/used internally within the feature _(defined in
close proximity to your [reducers])_.


#### Public Selectors

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

While **feature-redux** does not directly manage anything about
selectors, a feature may wish to promote some of it's selectors using
the **feature-u** [`fassets aspect`].

Please note that in consideration of feature encapsulation, *best
practices would strive to minimize the public promotion of feature
state (and selectors) outside the feature boundary*.

</ul>


#### Feature State Location (Single Source of Truth)

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

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

Here is an example _(see: `**5**` and `**6**`)_:


```js
                             // **5** DEFINITION
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState);

                             // **6** USAGE
                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```

</ul>


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
   mechanism").  As an example, the [feature-redux-logic] Aspect
   integrates **redux-logic**.

3. **Enhancer Integration**:

   Because **feature-redux** manages [redux], other Aspects can
   promote their [redux enhancer] through **feature-redux**'s
   `Aspect.getReduxEnhancer()` API (an "aspect cross-communication
   mechanism").


### Exposure

1. **Primary Output**:

   The primary way in which **feature-redux** exposes [redux] to your
   app is by injecting the standard **redux** [`<Provider>`] component at
   the root of your application DOM.  This enables app component
   access to the [redux store] (along with it's `dispatch()` and
   `getState()`) through the standard **redux** [`connect()`] function.

2. **Redux Middleware**:

   Because **feature-redux** allows other aspects to inject their
   [redux middleware], whatever that middleware exposes is made
   available.  As an example, the [feature-redux-logic] Aspect
   injects **redux-logic**.

3. **Redux Enhancer**:

   Because **feature-redux** allows other aspects to inject their
   [redux enhancer], whatever that enhancer exposes is made
   available.
   
4. **Other**:

   - For good measure, **feature-redux** promotes the [redux store]
     through the `Aspect.getReduxStore()` method.  This provides direct
     access to the [store] to any external process that needs it.

   - Integration with Redux DevTools is automatically configured (when
     detected).


### Error Conditions

- **NO REDUCERS**:

  When **feature-redux** detects that no reducers have been
  specified by any of your features, it will (by default) throw the
  following exception:

  ```
  ***ERROR*** feature-redux found NO reducers within your features
              ... did you forget to register Feature.reducer aspects in your features?
              (please refer to the feature-redux docs to see how to override this behavior).
  ```

  Most likely this should in fact be considered an error _(for example
  you neglected to specify the reducer aspects within your features)_.
  **The reasoning is**: _why would you not specify any reducers if your
  using redux?_

  You can change this behavior through the `allowNoReducers` parameter:

  ```js
  createReducerAspect({allowNoReducers: true})
  ```

  - when `true`, and no reducers are found, redux will be configured
    with an identity reducer (accompanied with a WARNING logging
    probe).

  - you can also specify your own app-wide reducer function in place
    of the `true` value, which will be used ONLY in the scenario where
    no reducers were specified by your features.


## API

### reducerAspect: Aspect

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

```
API: createReducerAspect({name:'reducer',
                          initialState:undefined,
                          allowNoReducers:false}): reducerAspect
```

The `reducerAspect` is the [feature-u] plugin that facilitates
[redux] integration to your features.

**PARAMS**: _(**Please Note**: only named parameters are used)_

- **name**: The name of this reducer (defaults to 'reducer')

- **initialState**: An optional pre-loaded state that will become the initial
  state of your store.  

  Typically this is not needed, because your reducers will define the
  initial state.
  However, it can be useful to hydrate the state from the server (in
  universal apps), or to restore a previously serialized user session.

  When supplied, any validation/errors will be detected by redux, as
  it is passed directly to it's `createStore()`.

- **allowNoReducers**: A boolean -or- app-wide reducer function, that
  specifies what to do when **no reducers** are found in any or your
  features (defaults to `false` which throws an error) ... see: **NO
  REDUCERS** section of [Error Conditions](#error-conditions)


**USAGE**:

- Within your mainline, register the **feature-redux**
  `reducerAspect` to **feature-u**'s [`launchApp()`].

- Within each feature that maintains state, simply register the
  feature's reducer through the `Feature.reducer` property _(using
  **feature-u**'s [`createFeature()`])_.

  Because the state of each feature is combined into one overall
  appState, the feature reducer must identify it's root location,
  through the [`slicedReducer()`] function.  This **slice** can
  optionally reference a federated namespace corresponding to the
  desired target shape.

Please refer to the [Usage] section for examples of this process.

</ul>


### slicedReducer()

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

**API:** `slicedReducer(slice, reducer): reducer`

Embellish the supplied reducer with a slice property - a
specification (interpreted by **feature-redux**) as to the
location of the reducer within the top-level appState tree.

Please refer to the [Sliced Reducers] section for a
complete description with examples.

**Note:** `slicedReducer()` should always wrap the the outer
function passed to [`createFeature()`], even when [`expandWithFassets()`]
is used.  This gives your app code access to the embellished
`getSlicedState()` selector, even prior to expansion occurring (_used
as a single-source-of-truth in your selector definitions_).


**Parameters**:

- **slice**: string

  The location of the managed state within the overall top-level
  appState tree.  This can be a federated namespace _(delimited by
  dots)_.  Example: `'views.currentView'`

- **reducer**: reducerFn

  The redux [reducer] function to be embellished with the slice
  specification.

**Return**: reducerFn

<ul style="margin-left: 2em;">

the supplied reducer, embellished with both the slice and a
convenience selector:

```js
reducer.slice: slice
reducer.getSlicedState(appState): slicedState
```
</ul>

</ul>


## Potential Need for Polyfills

The implementation of this library employs modern es2015+ JavaScript
constructs.  Even though the library distribution is transpiled to
[es5](https://en.wikipedia.org/wiki/ECMAScript#5th_Edition) _(the
least common denominator)_, **polyfills may be required** if you are
using an antiquated JavaScript engine _(such as the IE browser)_.

We take the approach that **polyfills are the responsibility of the
client app**.  This is a legitimate approach, as specified by the [W3C
Polyfill Findings](https://www.w3.org/2001/tag/doc/polyfills/)
_(specifically [Advice for library
authors](https://www.w3.org/2001/tag/doc/polyfills/#advice-for-library-and-framework-authors))_.

- polyfills should only be introduced one time _(during code expansion
  of the app)_
- a library should not pollute the global name space _(by including
  polyfills at the library level)_
- a library should not needlessly increase it's bundle size _(by
  including polyfills that are unneeded in a majority of target
  environments)_

As it turns out, **app-level polyfills are not hard to implement**,
with the advent of third-party utilities, such as babel:

- simply import [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill.html)
- or use babel's
  [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env.html)
  in conjunction with babel 7's `"useBuiltins": "usage"` option

**If your target JavaScript engine is inadequate, it will generate
native run-time errors, and you will need to address the polyfills.**
Unfortunately, in many cases these errors can be very obscure _(even
to seasoned developers)_.  The following [Babel Feature
Request](https://github.com/babel/babel/issues/8089) _(if/when
implemented)_ is intended to address this issue.




<!--- *** REFERENCE LINKS *** ---> 

<!--- **feature-redux** ---> 
[`reducerAspect`]:   #reduceraspect-aspect
[Sliced Reducers]:   #sliced-reducers
[Usage]:             #usage
[`slicedReducer()`]: #slicedreducer

<!--- **feature-redux-logic** ---> 
[feature-redux-logic]:  https://github.com/KevinAst/feature-redux-logic/

<!--- feature-u ---> 
[feature-u]:              https://feature-u.js.org/
[`launchApp()`]:          https://feature-u.js.org/cur/api.html#launchApp
[`createFeature()`]:      https://feature-u.js.org/cur/api.html#createFeature
[`expandWithFassets()`]:  https://feature-u.js.org/cur/api.html#expandWithFassets
[`fassets aspect`]:       https://feature-u.js.org/cur/api.html#fassets
[`Feature`]:              https://feature-u.js.org/cur/api.html#Feature
[`Fassets object`]:       https://feature-u.js.org/cur/api.html#Fassets
[Managed Code Expansion]: https://feature-u.js.org/cur/crossCommunication.html#managed-code-expansion

<!--- react ---> 
[react]:            https://reactjs.org/


<!--- redux ---> 

[redux]:            https://redux.js.org/
[redux store]:      https://redux.js.org/glossary#store
[store]:            https://redux.js.org/glossary#store
[redux middleware]: https://redux.js.org/glossary#middleware
[redux enhancer]:   https://redux.js.org/glossary#store-enhancer
[actions]:          https://redux.js.org/glossary#action
[action creators]:  https://redux.js.org/glossary#action-creator
[reducers]:         https://redux.js.org/glossary#reducer
[reducer]:          https://redux.js.org/glossary#reducer
[selectors]:        https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170
[`connect()`]:      https://github.com/reduxjs/react-redux/blob/master/docs/using-react-redux/connect-extracting-data-with-mapStateToProps.md
[`<Provider>`]:     https://github.com/reduxjs/react-redux/blob/master/docs/api/Provider.md

<!--- redux-logic ---> 
[redux-logic]:      https://github.com/jeffbski/redux-logic

<!--- 3rd party action managers ---> 
[action-u]:         https://action-u.js.org/
[redux-actions]:    https://github.com/reduxactions/redux-actions
