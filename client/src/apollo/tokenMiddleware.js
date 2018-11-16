import { ApolloLink } from 'apollo-link';

export const getTokenMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers }) => ({
		headers: {
			...headers,
			Authorization: localStorage.getItem('authorization') || null,
		},
	}));

	return forward(operation);
});

export const setTokenAfterware = new ApolloLink((operation, forward) => {
	return forward(operation).map(res => {
		const context = operation.getContext();
		const {
			response: { headers },
		} = context;

		const token = headers.get('Authorization');

		if (token) {
			localStorage.setItem('authorization', token);
		}

		return res;
	});
});
