import React, { Fragment, Component } from 'react';
import ReactTableCustom from '../../components/UI/ReactTableCustom';
import gql from 'graphql-tag';
import { graphql, Query } from 'react-apollo';

import { Spin, Button, message, Popover } from 'antd';

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

const waitingUsersQuery = gql`
	{
		waitingUsers {
			id
			username
			name
			email
		}
	}
`;

const mutationResponseToWaitingUsers = gql`
	mutation($userId: ID!, $accepted: Boolean!) {
		responseToWaitingUser(userId: $userId, accepted: $accepted)
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

	warningMsg = msg => {
		message.warning(msg);
	};

	respond = (accepted, userId) => async () => {
		try {
			await this.props.mutate({
				// Delete user from cache on successfull response
				update: (store, { data: { responseToWaitingUser } }) => {
					if (!responseToWaitingUser) {
						return this.warningMsg('Something went wrong');
					}

					// Read the data from our cache for this query.
					const data = store.readQuery({ query: waitingUsersQuery });

					// Add our todo from the mutation to the end.
					const newWaitingUsers = data.waitingUsers.filter(user => user.id !== userId);

					// Write our data back to the cache.
					store.writeQuery({
						data: {
							waitingUsers: newWaitingUsers,
						},
						query: waitingUsersQuery,
					});
				},
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
			<Query query={waitingUsersQuery}>
				{({ data, loading }) =>
					loading ? (
						<div className={classes.loading}>
							<Spin size="large" />
						</div>
					) : (
						<Fragment>
							<h3>Waiting users</h3>
							<ReactTableCustom
								data={(data && data.waitingUsers) || []}
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
export default graphql(mutationResponseToWaitingUsers)(injectSheet(style)(UsersAuthorizationList));
