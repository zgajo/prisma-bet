import React from 'react';
import decode from 'jwt-decode';

import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './view/Dashboard';
import Login from './view/Login';

const isAuth = () => {
	try {
		const token = localStorage.getItem('authorization');

		const t = decode(token);
		const { exp } = t;
		const currentTime = new Date().getTime() / 1000;

		// Token expired
		if (exp < currentTime) {
			localStorage.removeItem('authorization');
			return false;
		}

		return true;
	} catch (error) {
		localStorage.removeItem('authorization');
		return false;
	}
};

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
