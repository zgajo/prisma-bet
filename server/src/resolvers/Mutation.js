import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { APP_SECRET, tokenCreationData } from '../utils/token';
import { sendEmailNewUserToAdmin } from '../utils/email';

//TODO: Bet site -> bet_site_user <- User // many to many
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
			token: sign({ ...tokenCreationData(user) }, APP_SECRET, { expiresIn: '1h' }),
		};
	},
	responseWaitingUser: async (_, { userId, accepted }, { db }) => {
		try {
			await db.mutation.updateUser({ data: { accepted }, where: { id: userId } });

			//TODO: send mail to user on response
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

module.exports = {
	Mutation,
};
