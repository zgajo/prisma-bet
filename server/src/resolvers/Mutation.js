const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

const Mutation = {
	login: async (_, { username, password }, ctx) => {
		const user = await ctx.db.query.user({ where: { username } });

		if (!user) {
			// No user for username
			throw new Error(`Invalid credentials 011`);
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			// Passwords not match
			throw new Error(`Invalid credentials 012`);
		}

		return {
			token: sign({ userId: user.id }, APP_SECRET),
			user,
		};
	},
	signup: async (_, { name, username, password }, ctx) => {
		const hashedPassword = await hash(password, 10);

		const user = await ctx.db.mutation.createUser({
			data: {
				name,
				password: hashedPassword,
				username,
			},
		});

		return {
			token: sign({ userId: user.id }, APP_SECRET),
			user,
		};
	},
};

module.exports = {
	Mutation,
};
