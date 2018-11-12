const { rule, shield } = require('graphql-shield');
const { sign } = require('jsonwebtoken');
const { getUserId, APP_SECRET } = require('../utils');

const rules = {
	isAuthenticated: rule()((parent, args, ctx) => {
		const userId = getUserId(ctx);
		const userIdValid = !!userId;

		if (userIdValid) {
			ctx.response.set('authorization', sign({ userId: userId }, APP_SECRET, { expiresIn: '1h' }));
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
