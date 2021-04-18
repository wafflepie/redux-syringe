# Thunk

> yarn add @redux-syringe/thunk

A [Redux Thunk](https://github.com/reduxjs/redux-thunk) clone adapted for Redux Syringe: it passes the namespace of a thunk dispatched via `useNamespacedDispatch` or `namespacedConnect` down to all actions dispatched from within the thunk.

Make sure to inject this middleware before any other middleware.

## API Reference

Same as of Redux Thunk, with two important exceptions:

- Instead of `dispatch, getState`, the thunk receives `{ dispatch, getState, getNamespacedState, namespace }` as a single argument.
- Instead of `withExtraArgument`, you can use `withDependencies` with an object, which is spread into the aforementioned single argument.
