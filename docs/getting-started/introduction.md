# Redux Syringe {docsify-ignore-all}

[![GitHub Stars](https://img.shields.io/github/stars/wafflepie/redux-syringe)](https://github.com/wafflepie/redux-syringe)
[![GitHub Issues](https://img.shields.io/github/issues/wafflepie/redux-syringe?color=bada55)](https://github.com/wafflepie/redux-syringe/issues)
[![License](https://img.shields.io/badge/licence-MIT-ff69b4)](https://github.com/wafflepie/redux-syringe)
[![Downloads](https://badgen.net/npm/dm/redux-syringe)](https://npmjs.com/package/redux-syringe)
[![Version](https://badgen.net/npm/v/redux-syringe)](https://npmjs.com/package/redux-syringe)

A collection of tools for maintaining large Redux applications by enabling dependency injection of Redux code and development of multi-instance components by namespacing their state.

Redux Syringe consists mainly of:

- [Store enhancers](https://github.com/reduxjs/redux/blob/master/docs/Glossary.md#store-enhancer) for injecting reducers, middleware, and epics into your Redux store after the store is created.
- Logic for managing your state via [namespaces](/tutorial/02-namespacing).

Although the Redux Syringe core is platform-agnostic, [React](https://github.com/facebook/react/) bindings are included for tying the injection mechanism to the lifecycle of your components. The [quick start guide](/getting-started/quick-start) and the [tutorial](/tutorial/01-dependency-injection) use React as the view library of choice.

## Installation

The `redux-syringe` package contains everything you'll need to get started with using Redux Syringe in a React application. Use either of these commands, depending on the package manager you prefer:

```sh
yarn add redux-syringe

npm i redux-syringe
```

## Packages

Here are the packages `redux-syringe` reexports:

- [@redux-syringe/namespaces](/packages/namespaces), logic for associating Redux actions with a namespace.
- [@redux-syringe/namespaces-react](/packages/namespaces), React bindings for the `namespaces` package.
- [@redux-syringe/reducers](/packages/reducers), store enhancer for asynchronous injection of reducers.
- [@redux-syringe/reducers-react](/packages/reducers-react), React bindings for the `reducers` package.
- [@redux-syringe/middleware](/packages/middleware), store enhancer for asynchronous injection of middleware.
- [@redux-syringe/middleware-react](/packages/middleware-react), React bindings for the `middleware` package.
- [@redux-syringe/thunk](/packages/thunk), custom implementation of [Redux Thunk](https://github.com/reduxjs/redux-thunk) with namespacing support.

Take a look at the [package index](https://github.com/wafflepie/redux-syringe/blob/main/presets/redux-syringe/src/index.js) to see all the available exports.

Based on your preferred method of handling side effects, install any of the following packages as well:

- [@redux-syringe/epics](/packages/epics), store enhancer for asynchronous injection of [epics](https://redux-observable.js.org/).
- [@redux-syringe/epics-react](/packages/epics-react), React bindings for the `epics` package.
- [@redux-syringe/stream-creators](/packages/stream-creators), collection of stream creators for the `epics` package.

## Changelog

See the [CHANGELOG.md](https://github.com/wafflepie/redux-syringe/blob/main/CHANGELOG.md) file in our [repository](https://github.com/wafflepie/redux-syringe).

## Resources

- [Beyond Simplicity: Using Redux in Dynamic Applications](https://medium.com/@wafflepie/beyond-simplicity-using-redux-in-dynamic-applications-ae9e0aea928c) (published 21 Jan 2019)

## License

All packages are distributed under the MIT license. See the license [here](https://github.com/wafflepie/redux-syringe/blob/main/LICENSE).
