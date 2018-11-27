const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const crypto = require('crypto');

const { APP_SECRET, tokenCreationData } = require('../../utils/token');
const { sendEmailNewUserToAdmin, resetTokenMail, sendResponseEmailToUser } = require('../../utils/email');

//TODO: Bet site -> bet_site_user <- User // many to many

module.exports = {
	forgotPassword: async (_, { email }, ctx) => {
		try {
			const user = await ctx.db.query.user({ where: { email } });

			if (!user) {
				return {
					message: 'Email not found',
					success: false,
				};
			}

			const resetPasswordToken = crypto.randomBytes(20).toString('hex');
			let resetPasswordExpires = new Date();
			resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

			await ctx.db.mutation.updateUser({
				data: {
					resetPasswordExpires,
					resetPasswordToken,
				},
				where: { id: user.id },
			});

			await resetTokenMail(user, resetPasswordToken);

			return {
				message: 'Recovery mail sent',
				success: true,
			};
		} catch (error) {
			return {
				message: error.message,
				success: false,
			};
		}
	},
	forgotPasswordConfirm: async (_, { password, password_confirm, resetPasswordToken }, ctx) => {
		try {
			const users = await ctx.db.query.users({ where: { resetPasswordToken } });

			if (!users.length)
				return {
					message: 'Token not found',
					success: false,
				};

			const user = users[0];

			if (new Date() > user.resetPasswordExpires)
				return {
					message: 'Reset password time expired',
					success: false,
				};

			if (password !== password_confirm)
				return {
					message: 'Passwords do not match',
					success: false,
				};

			const hashedPassword = await hash(password, 10);

			await ctx.db.mutation.updateUser({
				data: {
					password: hashedPassword,
					resetPasswordExpires: null,
					resetPasswordToken: null,
				},
				where: { id: user.id },
			});

			return {
				message: 'Password succesfully changed',
				success: true,
			};
		} catch (error) {
			return {
				message: 'There was an error',
				success: false,
			};
		}
	},
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
			token: sign({ ...tokenCreationData(user) }, APP_SECRET, { expiresIn: '1h' }),
		};
	},
	responseToWaitingUser: async (_, { userId, accepted }, { db }) => {
		try {
			const user = await db.query.user({ where: { id: userId } });

			if (!user) return false;

			if (!accepted) {
				await db.mutation.deleteUser({
					where: {
						id: user.id,
					},
				});

				// Send reject email
				sendResponseEmailToUser(user, accepted);
				return true;
			}

			await db.mutation.updateUser({ data: { accepted }, where: { id: userId } });

			// send accept mail to user
			sendResponseEmailToUser(user, accepted);

			return true;
		} catch (error) {
			return false;
		}
	},
	signup: async (_, { name, username, password, email }, ctx) => {
		let createdUser = null;
		try {
			if (!password || password.length < 6 || password.length > 20) {
				return {
					message: 'Password is not in required characters range',
					success: false,
				};
			}

			const hashedPassword = await hash(password, 10);

			createdUser = await ctx.db.mutation.createUser({
				data: {
					email,
					name,
					password: hashedPassword,
					username,
				},
			});

			// If message sending fails, try to repeat sending 3 times, if it's not sent delete created user from db and notify user to try signup little later
			// Notifiying admin about new user creation
			await sendEmailNewUserToAdmin(name, email, createdUser.id);

			return {
				message: 'Message successfully sent to admin. You will receive email for next steps.',
				success: true,
			};
		} catch (error) {
			// Delete created user (email has not been sent)
			if (createdUser) {
				await ctx.db.mutation.deleteUser({
					where: {
						id: createdUser.id,
					},
				});
			}

			return {
				message: error.message,
				success: false,
			};
		}
	},
};
