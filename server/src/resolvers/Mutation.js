const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

const Mutation = {
	login: async (_, { email, password }, ctx, info) => {
		const user = await ctx.db.query.users({ where: { email: 'test@gs.lk' } }, info);

		if (!user) {
			throw new Error(`No user found for email: ${email}`);
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error('Invalid password');
		}

		return {
			token: sign({ userId: user.id }, APP_SECRET),
			user,
		};
	},
	signup: async (_, { name, email, password }, ctx, info) => {
		const hashedPassword = await hash(password, 10);

		const user = await ctx.db.mutation.createUser(
			{
				data: {
					email,
					name,
					password: hashedPassword,
				},
			},
			info,
		);

		return {
			//
			...user,
			token: { token: sign({ userId: user.id }, APP_SECRET) },
		};
	},
};

module.exports = {
	Mutation,
};
