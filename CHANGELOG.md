# Change Log

The **feature-redux** project adheres to [Semantic
Versioning](http://semver.org/).

Each release is documented on this page *(in addition to the [Github
Release Notes](https://github.com/KevinAst/feature-redux/releases))*,
and **contains migration instructions**.

## Summary:

Release  | What                                            | *When*
---------|-------------------------------------------------|------------------
[v0.1.2] | Auto Redux DevTools Integration                 | *March 29, 2018*
[v0.1.1] | react-native android patch                      | *March 7, 2018*
[v0.1.0] | Initial Release                                 | *March 6, 2018*

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

UNRELEASED ******************************************************************************** -->


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

