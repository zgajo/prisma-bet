import React from 'react';
import ReactTableCustom from '../../../components/UI/ReactTableCustom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Spin } from 'antd';

import injectSheet from 'react-jss';

const style = {
	loading: {
		'align-items': 'center',
		display: 'flex',
		'justify-content': 'center',
		'min-height': 'inherit',
	},
};

const columns = [
	{
		Header: 'Name',
		accessor: 'name', // String-based value accessors!
	},
	{
		Header: 'Username',
		accessor: 'username', // String-based value accessors!
	},
];

const usersQuery = gql`
	{
		users {
			id
			username
			name
		}
	}
`;

export const UsersAuthorizationList = injectSheet(style)(props => {
	const { classes } = props;
	return (
		<Query query={usersQuery}>
			{({ loading, error, data }) =>
				loading ? (
					<div className={classes.loading}>
						<Spin size="large" />
					</div>
				) : (
					<ReactTableCustom data={data.users} columns={columns} defaultPageSize={5} className="-striped -highlight" />
				)
			}
		</Query>
	);
});
