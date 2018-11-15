const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');
const { sendNewUserMail } = require('../utils');
const Mutation = {
	login: async (_, { username, password }, ctx) => {
		const user = await ctx.db.query.user({ where: { username } });

		if (!user) {
			// No user for username
			throw new Error(`Invalid credentials`);
		}

		const valid = await compare(password, user.password);

		if (!valid) {
			// Passwords not match
			throw new Error(`Invalid credentials`);
		}

		return {
			success: true,
			token: sign({ name: user.name, userId: user.id }, APP_SECRET, { expiresIn: '1h' }),
		};
	},
	signup: async (_, { name, username, password, email }, ctx) => {
		try {
			const hashedPassword = await hash(password, 10);

			await ctx.db.mutation.createUser({
				data: {
					email,
					name,
					password: hashedPassword,
					username,
				},
			});

			// TODO: If message sending fails, try to repeat sending 5 times (once every min), if it's not sent delete created user from db and notify user to try signup little later
			// Notifiying admin about new user creation
			await sendNewUserMail(name, email);

			return {
				message: 'Message successfully sent to admin. You will receive email for next steps.',
				success: true,
			};
		} catch (error) {
			return {
				message: error.message,
				success: false,
			};
		}
	},
};

module.exports = {
	Mutation,
};
