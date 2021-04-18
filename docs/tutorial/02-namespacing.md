# Namespacing

Let's assume that we have to develop a widget that can be used multiple times on a single page. The catch: it should store its data in Redux. Furthermore, every instance of the widget should have its own isolated state. Redux Syringe offers a mechanism to handle this very efficiently.

Enter namespaces.

## Basic Concepts

The simplest example we could think of is a click counter.

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

Okay, this is getting slightly more complex. Our counter component expects a namespace to be provided to it! Let's render a bunch of them.

```js
<Counter namespace="foo" />
<Counter namespace="bar" />
<Counter namespace="baz" />
```

The state structure will look like this:

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

Under the hood, `withReducers` and `useNamespacedSelector` will operate over `state.namespaces.foo` because `withNamespaceProvider` has made the `"foo"` namespace available to it via React context.

?> The `namespaces` key is referred to as `DEFAULT_FEATURE` in the codebase. This is because Redux Syringe can be used to develop generic widgets as well as specific [multi-instance components](/tutorial/03-multi-instance-components).

When the `INCREMENT` action is dispatched, the action will look like this:

```js
const action = {
	type: 'INCREMENT',
	meta: { namespace: 'foo' },
};
```

The `meta.namespace` attribute was added automatically by `useNamespacedDispatch`. What's the point of that? Because our counter was mounted three times, there are three instances of our reducers injected as well, each with a different namespace. If an action has a different namespace than the reducer, **it will be ignored**.

!> For this reason, avoid using multiple namespaces within a single widget or module. Mixing namespaces may result in unexpected behavior and hard-to-track bugs due to actions being ignored.

Remember that if you need to opt out of the namespacing mechanism, just use the standard `useSelector` and `useDispatch` hooks from React Redux and pass `isGlobal: true` to any injector decorators.

## External Namespaces

Redux Syringe can also utilize an external source of namespaces. This is useful if you already have an architecture that wraps each widget/module in an arbitrary provider.

```js
import React, { createContext, useContext } from 'react';
import { NamespaceProvider } from 'redux-syringe';
import { Counter } from './Counter';

const WidgetNamespaceContext = createContext(null);

const wrapWidgetElement = (widgetElement, namespace) => (
	<WidgetNamespaceContext.Provider value={namespace}>
		{widgetElement}
	</WidgetNamespaceContext.Provider>
);

const useWidgetNamespace = () => useContext(WidgetNamespaceContext);

const CounterExample = () => (
	<NamespaceProvider useNamespace={useWidgetNamespace}>
		{wrapWidgetElement(<Counter />, 'foo')}
		{wrapWidgetElement(<Counter />, 'bar')}
		{wrapWidgetElement(<Counter />, 'baz')}
	</NamespaceProvider>
);
```

Any Redux Syringe decorator or hook inside a widget will now access the appropriate namespace without the need to wrap each widget in a separate namespace provider.

## Usage Guidelines for Standard SPAs

Namespaces are awesome for developing widgets that can be mounted multiple times in a single page. That being said, if you are developing a standard React application, namespaces might not be the best choice for you. Only use them for developing [custom reusable multi-instance components](/tutorial/03-multi-instance-components).

However, if your application is clearly split into isolated modules that rarely need to communicate with one another, namespaces might come in handy. There is one main rule you should follow: **never use multiple namespaces within a single module**. Mixing namespaces may result in some application logic not being triggered due to the actions being rejected by the namespacing mechanism.

!> The main reason for not using multiple namespaces within a single module is to avoid issues with namespace mixing. Therefore, it is fine to use multi-instance components inside your namespaced widgets/modules as these components should never interact with their surroundings. Of course, Redux Syringe fully supports arbitrary mixing and nesting of namespaces via the `feature` prop of the namespace provider.

The main reason for using namespaces even if you don't need to mount a module multiple times is implicit selector scoping. Compare the following state structures:

```json
{
	"someModule": {},
	"otherModule": {}
}
```

```json
{
	"namespaces": {
		"someModule": {},
		"otherModule": {}
	}
}
```

The second approach will allow you to omit specifying `someModule` and `otherModule` in your selectors – the state slice will be resolved by the namespacing mechanism via React context, assuming that your modules are wrapped in a namespace provider.

That being said, you'll also have to deal with yet another architectural concept, which might make it difficult for developers who only know the basics of React or Redux.

In conclusion, if you do decide to use namespaces in a standard React application:

- Make sure all of your modules are wrapped in a namespace provider (or multiple namespace providers).
- Make sure any common state is managed by a globally injected reducer.
- Make sure you're not accidentally mixing namespaces.
