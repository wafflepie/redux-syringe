# Multi-Instance Components {docsify-ignore-all}

Redux Syringe allows you to use the injection mechanism for generic multi-instance components too. This includes cool stuff like data grids, multi-step forms, and carousels.

Assume that you want to have multiple data grids mounted over a single page lifecycle, and you also want to store their state in Redux. To do that, you only need to write a reducer which manages the state of a single data grid, meaning that you never have to distinguish the individual data grids.

```js
import React from 'react';
import { withReducers, withNamespaceProvider } from 'redux-syringe';
import { compose } from 'ramda';
import { PureDataGrid } from './PureDataGrid';

const feature = 'grids';

// This reducer doesn't do anything, it has a static state.
const dataGridReducer = () => ({ data: [] });

const DataGrid = compose(
	withNamespaceProvider({ feature }),
	withReducers(dataGridReducer, { feature })
)(PureDataGrid);

const Example = () => <DataGrid namespace="DATA_GRID_1" />;
```

After the `<DataGrid namespace="DATA_GRID_1" />` element is mounted, `state.grids.DATA_GRID_1.data` will be an empty array.

Any actions dispatched via `useNamespacedDispatch` or `namespacedConnect` will only affect this data grid instance, same applies to `withEpics` and `withMiddleware`.

!> Make sure you manually pass the `{ feature }` option to all hooks and decorators, otherwise the namespace resolution mechanism will fall back to `"namespaces"`, the default feature.

If you want to affect this data grid instance by Redux actions from the outside, you will need to associate these actions with its namespace (i.e. set their `meta.namespace` property). The recommended way to do this is to use the `attachNamespace(namespace, action)` utility function from [@redux-syringe/namespaces](/packages/namespaces?id=attachNamespace). Alternatively, if dispatching from within a React component, you can also use the `useNamespacedDispatch({ namespace })` hook from [@redux-syringe/namespaces-react](/packages/namespaces-react?id=useNamespacedDispatch).
