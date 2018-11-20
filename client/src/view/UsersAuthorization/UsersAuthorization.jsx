import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import UsersAuthorizationList from './UsersAuthorizationList';
const { Content } = Layout;

export const UsersAuthorization = props => {
	const { location } = props;

	return (
		<Content style={{ padding: '0 50px' }}>
			<Breadcrumb style={{ margin: '16px 0' }}>
				<Breadcrumb.Item>
					<Link to="/users_auth">Users</Link>
				</Breadcrumb.Item>
				{!location.pathname.includes('edit') && <Breadcrumb.Item>List</Breadcrumb.Item>}
				{location.pathname.includes('edit') && <Breadcrumb.Item>Edit</Breadcrumb.Item>}
			</Breadcrumb>
			<div style={{ background: '#fff', minHeight: 280, padding: 24 }}>
				<Switch>
					<Route path="/users_auth/edit/:id" render={() => 'Edit user'} />
					<Route path="/" component={UsersAuthorizationList} />
				</Switch>
			</div>
		</Content>
	);
};
