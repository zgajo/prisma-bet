const { rule, shield } = require('graphql-shield');

const { getUserId } = require('../utils');

const rules = {
	isUser: rule()((parent, args, ctx) => {
		const userId = getUserId(ctx);

		return !!userId;
	}),
};

const permissions = shield({
	Query: {
		me: rules.isUser,
	},
});

module.exports = {
	permissions,
};
