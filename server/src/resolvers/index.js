const { Query } = require('./Query');
const { Mutation } = require('./Mutation');

const AuthPayload = {
	user: async ({ user: { id } }, args, ctx, info) => {
		return ctx.db.query.user({ where: { id } }, info);
	},
};

const resolvers = {
	AuthPayload,
	Mutation,
	Query,
};

module.exports = {
	resolvers,
};
