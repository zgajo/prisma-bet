import gql from 'graphql-tag';

export const waitingUsers = gql`
	query waitingUsers($where: UserWhereInput, $orderBy: UserOrderByInput) {
		waitingUsers(where: $where, orderBy: $orderBy) {
			id
			admin
			createdAt
			email
			name
			username
		}
	}
`;
export const me = gql`
	query me {
		me {
			id
			admin
			createdAt
			email
			name
			username
		}
	}
`;
export const users = gql`
	query users($where: UserWhereInput, $orderBy: UserOrderByInput) {
		users(where: $where, orderBy: $orderBy) {
			id
			admin
			createdAt
			email
			name
			username
		}
	}
`;
