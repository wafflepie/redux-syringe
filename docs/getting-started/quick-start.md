# Quick Start

Let's take a look on how we'd use Redux Syringe in a simple React application.

## Global Injection

This is the go-to way to use Redux Syringe in standard SPAs.

```js
import React from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { withReducers } from 'redux-syringe';

const initialState = {
	value: 0,
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment(state) {
			state.value++;
		},
	},
});

const selectCounterValue = state => state.counter.value;

const PureCounter = () => {
	const dispatch = useDispatch();
	const counterValue = useSelector(selectCounterValue);

	return <button onClick={() => dispatch(counterSlice.actions.increment())}>{counterValue}</button>;
};

export const Counter = withReducers({ counter: counterSlice.reducer })(Counter);
```

```js
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { makeReducersEnhancer } from 'redux-syringe';
import { Provider } from 'react-redux';

import { Counter } from './Counter';

const store = createStore(state => state, makeReducersEnhancer());

render(
	<Provider store={store}>
		<Counter />
	</Provider>,
	document.getElementById('root')
);
```

```json
{
	"counter": {
		"value": 0
	}
}
```

## Namespaced Injection

This is the go-to way to use Redux Syringe if any of these apply:

- Your application is cleary split into standalone modules which rarely communicate with one another.
- Your application consists of widgets which store their data in Redux and can be mounted multiple times.

```js
import React from 'react';
import { compose } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import {
	withReducers,
	withNamespaceProvider,
	useNamespacedSelector,
	useNamespacedDispatch,
} from 'redux-syringe';

const initialState = {
	value: 0,
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment(state) {
			state.value++;
		},
	},
});

const selectCounterValue = state => state.counter.value;

const PureCounter = () => {
	const dispatch = useNamespacedDispatch();
	const counterValue = useNamespacedSelector(selectCounterValue);

	return <button onClick={() => dispatch(counterSlice.actions.increment())}>{counterValue}</button>;
};

export const Counter = compose(
	withNamespaceProvider(),
	withReducers({ counter: counterSlice.reducer })
)(PureCounter);
```

```js
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { makeReducersEnhancer } from 'redux-syringe';
import { Provider } from 'react-redux';

import Counter from './Counter';

const store = createStore(state => state, makeReducersEnhancer());

render(
	<Provider store={store}>
		<Counter namespace="foo" />
		<Counter namespace="bar" />
		<Counter namespace="baz" />
	</Provider>,
	document.getElementById('root')
);
```

```json
{
	"namespaces": {
		"foo": {
			"counter": {
				"value": 0
			}
		},
		"bar": {
			"counter": {
				"value": 0
			}
		},
		"baz": {
			"counter": {
				"value": 0
			}
		}
	}
}
```
