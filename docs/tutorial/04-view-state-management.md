# View State Management {docsify-ignore-all}

Redux Syringe supports deep reducer injection, meaning that you can organize state for huge applications very easily.

```json
{
	"userManagement": {
		"userDetail": null,
		"userList": [],
		"hasPermissions": true
	}
}
```

```js
// Dummy reducer, manages `state.userManagement.userList`.
const userListReducer = () => [];

const PureUserList = () => {
	const users = useSelector(getUsers);

	return users.map(user => user.name);
};

export const UserList = withReducers({
	userManagement: {
		userList: userListReducer,
	},
})(PureUserList);
```

```js
// Dummy reducer, manages `state.userManagement.userDetail`.
const userDetailReducer = () => null;

const PureUserDetail = ({ userId }) => {
	const user = useSelector(getUser(userId));

	return user.name;
};

export const UserDetail = withReducers({
	userManagement: {
		userDetail: userDetailReducer,
	},
})(PureUserDetail);
```

```js
// Dummy reducer, manages `state.userManagement` and is composed with the inner reducers.
const userManagementReducer = state => ({
	...state,
	hasPermissions: true,
});

const PureUserManagement = () => (
	<Router>
		<Route component={UserList} path="/users" />
		<Route component={UserDetail} path="/users/:userId" />
	</Router>
);

export const UserManagement = withReducers({ userManagement: userManagementReducer })(
	PureUserManagement
);
```
