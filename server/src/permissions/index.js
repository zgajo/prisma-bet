const { rule, shield } = require('graphql-shield');
const { sign } = require('jsonwebtoken');
const { getUserId, APP_SECRET } = require('../utils');

const rules = {
	isAuthenticated: rule()((parent, args, ctx) => {
		const userId = getUserId(ctx);
		const userIdValid = !!userId;

		if (userIdValid) {
			ctx.response.set(
				'authorization',
				// change iat only if we're in  test enviroment
				// Doing this because if test token is issued at same second as this creation, it will generate same token and test will break
				sign({ ...(process.env.NODE_ENV === 'test' && { iat: new Date() - 1 }), userId: userId }, APP_SECRET, {
					expiresIn: '1h',
				}),
			);
		}

		return !!userId;
	}),
};

const permissions = shield({
	Query: {
		me: rules.isAuthenticated,
	},
});

module.exports = {
	permissions,
};
