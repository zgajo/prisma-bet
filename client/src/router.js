import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './view/Dashboard';
import Login from './view/Login';
import { isAuth } from './helpers/token';

const RouteMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)} />
);

const LoginMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (!isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />)} />
);

export const MainRouter = () => (
	<Switch>
		<LoginMiddleware path="/login" component={Login} />
		<RouteMiddleware path="/" component={Dashboard} />
	</Switch>
);
