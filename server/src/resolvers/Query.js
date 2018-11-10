const { getUserId } = require('../utils');

const Query = {
	me: (parent, args, ctx) => {
		return ctx.db.user({ id: getUserId(ctx) });
	},
	users: (parent, args, ctx, info) => {
		return ctx.db.query.users({}, info);
	},
};

module.exports = {
	Query,
};
