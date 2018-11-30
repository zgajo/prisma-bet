import gql from 'graphql-tag';

export const login = gql`
	mutation login($password: String!, $username: String!) {
		login(password: $password, username: $username) {
			message
			success
			token
		}
	}
`;

export const signup = gql`
	mutation signup($email: String!, $name: String!, $password: String!, $username: String!) {
		signup(email: $email, name: $name, password: $password, username: $username) {
			message
			success
		}
	}
`;

export const responseToWaitingUser = gql`
	mutation responseToWaitingUser($userId: ID!, $accepted: Boolean!) {
		responseToWaitingUser(userId: $userId, accepted: $accepted)
	}
`;

export const forgotPassword = gql`
	mutation forgotPassword($email: String!) {
		forgotPassword(email: $email) {
			message
			success
		}
	}
`;

export const forgotPasswordConfirm = gql`
	mutation forgotPasswordConfirm($password: String!, $password_confirm: String!, $resetPasswordToken: String!) {
		forgotPasswordConfirm(
			password: $password
			password_confirm: $password_confirm
			resetPasswordToken: $resetPasswordToken
		) {
			message
			success
		}
	}
`;
