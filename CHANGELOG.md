# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased

Nothing!

## [0.12.3] – 2022-06-20

### Added

- React v18 has been added to `peerDependencies` (alongside v16 and v17).
- React Redux v8 has been added to `peerDependencies` (alongside v6 and v7).

## [0.12.2] – 2021-09-19

### Changed

- (_thunk_): Typings have been updated.
  - Module augmentation overloading `Dispatch` has been added.
  - Type parameters have been reordered and renamed to resemble `redux-thunk` more closely.
  - `getNamespacedState()` is now a generic function instead of having a bound type.
- (_middleware_): Typings have been updated.
  - `getNamespacedState()` is now a generic function instead of having a bound type.

### Fixed

- (_injectors_): `setEntries` no longer creates shallow copies of the `store.entries` object, fixing server-side rendering warnings when multiple injector enhancers are applied to a store.

## [0.12.1] – 2021-08-17

### Changed

- (_injectors-react_): Use `typeof window === 'undefined'` to detect server-side rendering environments.

### Fixed

- (_injectors-react_): Add `isNamespaced` to injector `useEffect` dependencies.

## [0.12.0] – 2021-05-15

### Added

- TypeScript.
- (_thunk_): A named export of `thunkMiddleware` has been added in addition to the default one.

### Changed

- (_utils_): Miscellaneous breaking changes which shouldn't affect the end user.
- (_utils-react_): Miscellaneous breaking changes which shouldn't affect the end user.

### Fixed

- Dependencies in all packages have been cleaned up.

## [0.11.3] – 2021-05-09

### Changed

- `@babel/runtime` was added as a dependency to all packages.

## [0.11.2] – 2021-04-18

### Fixed

- Feature fallbacks are now more consistent. This should help with namespace resolution in some use cases.

## [0.11.1] – 2021-04-17

### Fixed

- (_redux-syringe_): Update `package.json#main,module,unpkg` fields.

## [0.11.0] – 2021-04-17

### Added

- (_redux-syringe_): Added reexport of `thunkMiddleware`.

### Removed

- (_utils_): `prefixedValueMirror` has been removed. The `@redux-syringe/actions` package thus no longer depends on any other Redux Syringe packages.

## [0.10.0] – 2021-04-17

### Changed

- All non-preset packages have been renamed from `@redux-tools/<package>` to `@redux-syringe/<package>`.
- The `@redux-tools/react` preset package was renamed to `redux-syringe`.

### Fixed

- (_redux-syringe_): Add missing `preventNamespace` reexport.

## [0.9.1] – 2020-07-23

### Added

- (_actions_): Added `makePayloadMetaActionCreator`.
- (_actions_): Added invariant to action creator factories which checks that the type is a non-empty string.
- (_actions_): Added invariant to `makePayloadActionCreator` and `makeEmptyActionCreator` for checking the correct number of arguments.
- (_injectors-react_): Added `isNamespaced` prop for all injector hooks and decorators. Use this option to indicate that an injectable must always be injected under a namespace.
- (_injectors-react_): It is now possible to reliably inject functions, arrays, and complex objects.
- (_middleware_): Added `composeMiddleware`.
- (_namespaces_): Added `preventNamespace`, which always overwrites the original namespace with a "global" namespace.
- (_namespaces_): Added `getStateByAction` and `getStateByNamespace` which always use the default feature.
- (_namespaces-react_): New package! Existing logic from various packages has been moved here (`useNamespace`, `NamespaceProvider` and `namespacedConnect`).
- (_namespaces-react_): `withNamespaceProvider` can now be used to create complex multi-instance components more easily.
- (_namespaces-react_): Added `useNamespacedDispatch` and `useNamespacedSelector` hooks.
- (_reducers_): `makeReducer` now supports arrays of strings and predicates.
- (_reducers_): It is now possible to inject deep reducer structures, allowing for view-based state management.

### Changed

- (_actions_): `makeConstantActionCreator` has been renamed to `makeEmptyActionCreator` (original export still present).
- (_actions_): Changed signatures of `makePayloadActionCreator` and `makeEmptyActionCreator`.
- (_actions_): `makeSimpleActionCreator` has been renamed to `makePayloadActionCreator` (original export still present).
- (_actions_): `makeActionCreator` has been renamed to `configureActionCreator`.
- (_actions_): `makeReducer` has been moved to the `@redux-tools/reducers` package.
- (_injectors-react_): `Provider` has been renamed to `NamespaceProvider`.
- (_injectors-react_): It is no longer necessary to pass `isGlobal: true` when not using the namespacing mechanism.
- (_namespaces_): Renamed `getStateByAction` and `getStateByNamespace` to `getStateByFeatureAndAction` and `getStateByFeatureAndNamespace`.
- (_namespaces-react_): `useNamespace` no longer falls back to `DEFAULT_FEATURE` if no namespace could be resolved.
- (_react_): The unpkg bundle now includes all dependencies except for React, Redux, and React Redux.
- (_reducers_): `makeReducer` now uses the default reducer for error actions if the error reducer is missing.
- (_reducers_): `getStateByAction` and `getStateByNamespace` have been moved to the `@redux-tools/namespaces` package.

### Fixed

- (_injectors-react_): Static namespace and feature in decorators is no longer passed down to inner components.
- (_namespaces-react_): Static namespace and feature in `namespacedConnect` is no longer passed down to inner components.

### Removed

- The unpkg bundle is no longer created for non-preset packages.

## [0.9.0] – 2020-07-23

Oops.

## [0.8.2] – 2020-03-05

### Fixed

- `ramda` and `ramda-extension` dependency versions are now less strict.
- All transitive peer dependencies are now listed in the appropriate packages.

## [0.8.1] – 2020-03-05

### Fixed

- (_reducers_): Reducer state is no longer cleaned up if an equal entry is still injected.

## [0.8.0] – 2020-02-28

### Added

- [redux-tools.js.org](https://redux-tools.js.org) ❤️
- (_react_): New package! `@redux-tools/react` reexports everything necessary to get started with Redux Tools in a React application.
- (_reducers_): Enhancer now supports initial reducers.

## [0.7.0] – 2020-01-10

### Fixed

- Appropriate dependencies added to `useEffect` in injection hooks.
- (_middleware_): Injected middleware are now properly called in the order of injection.
- (_reducers_): Existing state keys are now preserved to allow preloading of global state.
- (_reducers_): Clean up reducer state after ejection.

## [0.6.0] – 2019-08-06

### Added

- (_namespaces_): Added `attachNamespace`, which always overwrites the original namespace.
- (_middleware_): Middleware now automatically sets the namespace of each dispatched action.
- (_middleware_): `getNamespacedState` and `namespace` are now available in the first argument in all injected middleware.

### Changed

- (_namespaces_): Renamed `attachNamespace` to `defaultNamespace`.

### Fixed

- (_middleware_): Injected middleware are now properly called in the order of injection.
- (_middleware_): Middleware no longer automatically sets the namespace of each action via `next()`.

### Removed

- (_namespaces_): Unnecessary utility functions (`attachFeature` and `getFeatureByAction`).

## [0.5.0] – 2019-05-31

### Added

- Hook-based API. You can now use `useMiddleware`, `useEpics` and `useReducers` with a caveat: don't dispatch any actions until the injectables are injected (based on hook return value). Hooks are also used under the hood for better structure and performance.
- Loads of new useful warnings when injecting and ejecting.
- You can now define namespaces and features statically (or using props) in `withMiddleware`, `withEpics` and `withReducers`.
- You can now inject functions in addition to objects. Note that a function (reducer, middleware or epic) will only be initialized once per namespace/feature.
- Support for Redux Thunk! Just use our clone instead of the official implementation to enable automatic namespace passthrough via thunks.
- (_reducers_): Support for features! This allows using Redux Tools with a feature-based state structure, similar to when using e.g. Redux Form.
- (_reducers-react_): [Warn when using withReducers with global: false and no namespace.](https://github.com/lundegaard/redux-tools/pull/47)

### Changed

- The injection API was changed from `(injectables, namespace, version)` to `(injectables, { namespace, feature })`.
- All the `enhancer` exports were changed to `makeEnhancer` because of ambiguity in the injectable middleware enhancer.
- Loads of internal refactoring under the hood to reduce duplicate code and improve tests maintainability.
- `global` and `persist` options in decorators were renamed to `isGlobal` and `isPersistent`.
- (_middleware_): Injectable middleware enhancer now has an `injectedMiddleware` property, which you must use to signify the execution point of the middleware.

### Fixed

- (_middleware_): Correctly skip duplicate middleware.

## [0.4.0] – 2019-02-07

### Added

- (_reducers_): The reducer passed to `createStore()` as the first argument is now composed with the injected reducers.
- Support for injectable middleware! See the `middleware` and `middleware-react` packages.

### Fixed

- (_injectors-react_): Performance optimizations in `<InjectorContext.Consumer />`.

## [0.3.0] – 2019-01-09

### Added

- Documentation, including the README.md and FAQ.md files.
- (_actions_): `makeActionTypes` as an export of `prefixedValueMirror` from the utils package.

### Fixed

- (_utils_): `getDisplayName` function now handles strings.
- (_injectors-react_): Now compatible with react-redux v6.

## [0.2.0] - 2018-11-29

### Added

- This changelog!

### Changed

- (_epics_): `streamCreators` property has been renamed to `streamCreator` and now accepts a function instead of an array.
- (_injectors-react_): `<Provider />` is now a separate component which accepts `store`, `withNamespace` and `namespace` props directly. It also allows for seamless nesting (no need to always provide all properties).

### Fixed

- The injection mechanism now supports React async rendering.
- (_reducers_): Reducers now filter actions by namespace properly.
