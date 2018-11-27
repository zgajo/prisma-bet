import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './view/Dashboard';
import Login from './view/Login';
import { isAuth } from './helpers/token';
import Register from './view/Register';
import ResetPassword from './view/ResetPassword';
import ResetPasswordConfirm from './view/ResetPasswordConfirm';

const RouteMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)} />
);

const RegisterLoginMiddleware = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (!isAuth() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />)} />
);

export const MainRouter = () => (
	<Switch>
		<RegisterLoginMiddleware path="/reset_password/:token" component={ResetPasswordConfirm} />
		<RegisterLoginMiddleware path="/reset_password" component={ResetPassword} />
		<RegisterLoginMiddleware path="/login" component={Login} />
		<RegisterLoginMiddleware path="/register" component={Register} />
		<RouteMiddleware path="/" component={Dashboard} />
	</Switch>
);
