const { rule, shield, and } = require('graphql-shield');
const { sign } = require('jsonwebtoken');
const { getUser, APP_SECRET } = require('../utils');

const rules = {
	isAdmin: rule()(async (_, __, ctx) => {
		const user = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid) {
			const userAdmin = await ctx.db.query.user({ where: { id: user.userId } });
			return userAdmin.admin ? true : false;
		}

		return false;
	}),
	isAuthenticated: rule()((_, __, ctx) => {
		const user = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid) {
			ctx.response.set(
				'authorization',
				// change iat only if we're in  test enviroment
				// Doing this because if test token is issued at same second as this creation, it will generate same token and test will break
				sign({ ...(process.env.NODE_ENV === 'test' && { iat: new Date() - 1 }), userId: user.userId }, APP_SECRET, {
					expiresIn: '1h',
				}),
			);
		}

		return userIdValid;
	}),
};

const permissions = shield({
	Query: {
		accept_waiting_users: and(rules.isAuthenticated, rules.isAdmin),
		me: rules.isAuthenticated,
	},
});

module.exports = {
	permissions,
};
