const { rule, shield, and } = require('graphql-shield');
const { sign } = require('jsonwebtoken');
const { getUser, APP_SECRET, tokenCreationData } = require('../utils/token');

const rules = {
	isAdmin: rule()(async (_, __, ctx) => {
		const user = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid) {
			const userAdmin = await ctx.db.query.user({ where: { id: user.id } });

			return userAdmin.admin ? true : false;
		}

		return false;
	}),
	isAuthenticated: rule()((_, __, ctx) => {
		const user = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid) {
			// Giving client accessibility to authorization header
			ctx.response.set('Access-Control-Expose-Headers', 'authorization');

			ctx.response.set(
				'authorization',
				sign(
					{
						// change iat only if we're in  test enviroment
						// Doing this because if test token is issued at same second as this creation, it will generate same token and test will break
						...(process.env.NODE_ENV === 'test' && { iat: new Date() - 1 }),
						...tokenCreationData(user),
					},
					APP_SECRET,
					{
						expiresIn: '1h',
					},
				),
			);
		}

		return userIdValid;
	}),
};

const permissions = shield({
	Mutation: {
		responseToWaitingUser: and(rules.isAuthenticated, rules.isAdmin),
	},
	Query: {
		me: rules.isAuthenticated,
		waitingUsers: and(rules.isAuthenticated, rules.isAdmin),
	},
});

module.exports = {
	permissions,
};
