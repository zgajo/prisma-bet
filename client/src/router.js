import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './view/Dashboard';
import Login from './view/Login';
import { isAuth } from './helpers/token';
import Register from './view/Register';

const RouteMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)} />
);

const RegisterLoginMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (!isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />)} />
);

export const MainRouter = () => (
	<Switch>
		<RegisterLoginMiddleware path="/login" component={Login} />
		<RegisterLoginMiddleware path="/register" component={Register} />
		<RegisterLoginMiddleware path="/resetPassword" component={Register} />
		<RegisterLoginMiddleware path="/resetPassword/:token" component={Register} />
		<RouteMiddleware path="/" component={Dashboard} />
	</Switch>
);
