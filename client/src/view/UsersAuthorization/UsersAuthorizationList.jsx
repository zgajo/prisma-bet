import React, { Fragment, Component } from 'react';
import ReactTableCustom from '../../components/UI/ReactTableCustom';
import gql from 'graphql-tag';
import { Query, graphql } from 'react-apollo';

import { Spin, Button, Popover } from 'antd';

import injectSheet from 'react-jss';

const style = {
	button_right_margin: {
		'margin-right': '8px',
	},
	loading: {
		'align-items': 'center',
		display: 'flex',
		'justify-content': 'center',
		'min-height': 'inherit',
	},
};

const respondUsersQuery = gql`
	{
		waiting_users {
			id
			username
			name
			email
			accepted
		}
	}
`;

const mutationResponseWaitingUsers = gql`
	mutation($userId: ID!, $accepted: Boolean!) {
		responseWaitingUser(userId: $userId, accepted: $accepted)
	}
`;

class UsersAuthorizationList extends Component {
	confirm = (accepted, id) => (
		<div>
			<Button onClick={this.respond(accepted, id)} type="dashed" className="button-success">
				Confirm
			</Button>
		</div>
	);

	state = {
		columns: [
			{
				Header: 'Name',
				accessor: 'name', // String-based value accessors!
			},
			{
				Header: 'Username',
				accessor: 'username', // String-based value accessors!
			},
			{
				Header: 'Email',
				accessor: 'email', // String-based value accessors!
			},
			{
				Cell: row => {
					return (
						<div>
							<Popover content={this.confirm(true, row.original.id)} trigger="click">
								<Button type="primary" className={this.props.classes.button_right_margin}>
									Accept
								</Button>
							</Popover>
							<Popover content={this.confirm(false, row.original.id)} trigger="click">
								<Button type="danger">Decline</Button>
							</Popover>
						</div>
					);
				},
			},
		],
	};

	respond = (accepted, userId) => async () => {
		try {
			await this.props.mutation({
				variables: {
					accepted,
					userId,
				},
			});
		} catch (error) {}
	};

	render() {
		const { classes } = this.props;
		return (
			<Query query={respondUsersQuery}>
				{({ loading, error, data }) =>
					loading ? (
						<div className={classes.loading}>
							<Spin size="large" />
						</div>
					) : (
						<Fragment>
							<h3>Waiting users</h3>
							<ReactTableCustom
								data={(data && data.waiting_users) || []}
								columns={this.state.columns}
								defaultPageSize={5}
								className="-striped -highlight"
							/>
						</Fragment>
					)
				}
			</Query>
		);
	}
}
export default graphql(mutationResponseWaitingUsers)(injectSheet(style)(UsersAuthorizationList));
