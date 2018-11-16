const { getUser } = require('../utils/token');

const Query = {
	accept_waiting_users: (parent, args, ctx) => {
		return ctx.db.query.users({ where: { accepted: false } });
	},
	me: (parent, args, ctx, info) => {
		return ctx.db.query.user({ where: { id: getUser(ctx).id } }, info);
	},
	users: (parent, args, ctx, info) => {
		return ctx.db.query.users({}, info);
	},
};

module.exports = {
	Query,
};
