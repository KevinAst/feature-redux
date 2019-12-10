# Change Log

The **feature-redux** project adheres to [Semantic
Versioning](http://semver.org/).

Each release is documented on this page *(in addition to the [Github
Release Notes](https://github.com/KevinAst/feature-redux/releases))*,
and **contains migration instructions**.

## Summary:

Release  | What                                            | *When*
---------|-------------------------------------------------|------------------
[v1.0.1] | Address Security Alerts                         | *December 10, 2019*
[v1.0.0] | feature-u V1 Integration                        | *August 14, 2018*
[v0.1.3] | Establish Polyfill Strategy                     | *July 2, 2018*
[v0.1.2] | Auto Redux DevTools Integration                 | *March 29, 2018*
[v0.1.1] | react-native android patch                      | *March 7, 2018*
[v0.1.0] | Initial Release                                 | *March 6, 2018*


[v1.0.1]: #v101---address-security-alerts-december-10-2019
[v1.0.0]: #v100---feature-u-v1-integration-august-14-2018
[v0.1.3]: #v013---establish-polyfill-strategy-july-2-2018
[v0.1.2]: #v012---auto-redux-devtools-integration-march-29-2018
[v0.1.1]: #v011---react-native-android-patch-march-7-2018
[v0.1.0]: #v010---initial-release-march-6-2018



<!-- UNRELEASED **************************************************************************

TEMPLATE: 
## vn.n.n - DESC *(DATE ?, 2018)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/vn.n.n)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/vn.n.n)
&bull;
[Diff](see below)

RUNNING CONTENT (pop out as needed) ... 

- adorn bullets with following bolded prefix
  **Added**:      ... for new features
  **Changed**:    ... for changes in existing functionality
  **Deprecated**: ... for soon-to-be removed features
  **Removed**:    ... for now removed features
  **Fixed**:      ... for any bug fixes
  **Enhanced**:   ... for enhancements
  **Security**:   ... in case of vulnerabilities
  **Docs**:       ... changes in documentation
  **Review**:     ... requires review
  **Internal**:   ... internal change NOT affecting user/client

UNRELEASED ******************************************************************************** -->


<!-- *** RELEASE *************************************************************** -->

## v1.0.1 - Address Security Alerts *(December 10, 2019)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v1.0.1)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v1.0.1)
&bull;
[Diff](https://github.com/KevinAst/feature-redux/compare/v1.0.0...v1.0.1)

**NOTE**: This release is a **non-breaking change** _(i.e. no API was affected)_.

- **Security**: Address potential security vulnerabilities in
  dependent libs (mostly devDependencies completely unrelated to
  deployment)!


<!-- *** RELEASE *************************************************************** -->

## v1.0.0 - feature-u V1 Integration *(August 14, 2018)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v1.0.0)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v1.0.0)
&bull;
[Diff](https://github.com/KevinAst/feature-redux/compare/v0.1.3...v1.0.0)

**NOTE**: This release contains **breaking changes** from prior
releases _(i.e. a retrofit of client code is necessary)_.

- **Added/Removed**: Eliminate singletons in favor of creators

  The singleton: `reducerAspect`, has been replaced with a new creator:
  `createReducerAspect()`.

  This is useful in both testing and server side rendering.


- **Internal**: Integrate to [**feature-u V1**](https://feature-u.js.org/cur/history.html#v1_0_0)

  **feature-u V1** has replaced the `app` object with a `fassets`
  object.

  In general, this is not a change that would break a plugin, because
  app/fassets is a positional parameter that is merely passed through
  the plugin.  In other words the app/fassets is not directly
  interpreted by this plugin.

  However, **feature-redux** does have subtle indirect references to
  changed **feature-u V1** APIs, _such as Error message strings, etc_.

  Therefore, it is best to tidy up this detail.

  As a result, this plugin has now updated it's **feature-u**
  peerDependency to ">=1.0.0".


<!-- *** RELEASE *************************************************************** -->

## v0.1.3 - Establish Polyfill Strategy *(July 2, 2018)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v0.1.3)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v0.1.3)
&bull;
[Diff](https://github.com/KevinAst/feature-redux/compare/v0.1.2...v0.1.3)

**NOTE**: This release is a **non-breaking change** _(i.e. no API was affected)_.

- **Review**: A new policy is in affect where **polyfills are the
  responsibility of the client app**, when the target JavaScript
  engine is inadequate _(such as the IE browser)_.  Please refer to
  [Potential Need for
  Polyfills](./README.md#potential-need-for-polyfills) for more
  information.

  As a result, all previous code patches related to es2015+ polyfill
  issues were removed, in favor of **polyfilling at the app-level**.

- **Internal**: The most current babel version/configuration is now
  used to transpile the library's es5 distribution.


<!-- *** RELEASE *************************************************************** -->

## v0.1.2 - Auto Redux DevTools Integration *(March 29, 2018)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v0.1.2)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v0.1.2)
&bull;
[Diff](https://github.com/KevinAst/feature-redux/compare/v0.1.1...v0.1.2)

**NOTE**: This release is a **non-breaking change** _(i.e. no API was affected)_.

- **Enhanced**: Integration with Redux DevTools is automatically
  configured (when detected).

- **Docs**: Removed action-u reference from example code, using a more
  conventional "defined constant" action type.


<!-- *** RELEASE *************************************************************** -->

## v0.1.1 - react-native android patch *(March 7, 2018)*

[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v0.1.1)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v0.1.1)
&bull;
[Diff](https://github.com/KevinAst/feature-redux/compare/v0.1.0...v0.1.1?short_path=4ac32a7#diff-4ac32a78649ca5bdd8e0ba38b7006a1e)

**NOTE**: This release is a **non-breaking change** _(i.e. no API was affected)_.

- **Fixed**: A patch was applied in support of **react-native android**.

  When running react-native under android, receiving the following
  exception:

  ```
  ERROR: undefined is not a function
         evaluating 'content[typeof Symbol === 'function' ? Symbol.iterator: '@@iterator']()'
  ```

  This is a transpiler issue related to the es6 "for of" loop.  It is
  believed to be limited to the **react-native android JS engine**.

  This may be a babel transpiler issue (possibly due to a stale babel
  version), or an issue with with react-native android's JS engine.
  The problem was temporarily avoided by employing old style es5 "for
  loop" constructs (till further research is conducted).







<!-- *** RELEASE *************************************************************** -->

## v0.1.0 - Initial Release *(March 6, 2018)*
[GitHub Content](https://github.com/KevinAst/feature-redux/tree/v0.1.0)
&bull;
[GitHub Release](https://github.com/KevinAst/feature-redux/releases/tag/v0.1.0)

**This is where it all began ...**

