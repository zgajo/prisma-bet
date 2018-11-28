const { getUser } = require('../utils/token');

const Query = {
	me: (parent, args, ctx, info) => {
		return ctx.db.query.user({ where: { id: getUser(ctx).id } }, info);
	},
	users: (parent, args, ctx, info) => {
		return ctx.db.query.users({}, info);
	},
	waitingUsers: (parent, args, ctx) => {
		return ctx.db.query.users({ where: { ...args.where, accepted: false } });
	},
};

module.exports = {
	Query,
};
