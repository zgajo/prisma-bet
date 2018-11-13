/**
 * TODO:
 * Remove eslint comment
 */
// eslint-disable-next-line
const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { APP_SECRET } = require('../utils');

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
			token: sign({ name: user.name, userId: user.id }, APP_SECRET, { expiresIn: '1h' }),
			user,
		};
	},
	/**
	 * TODO:
	 * Remove eslint comment
	 */
	// eslint-disable-next-line
	signup: async (_, { name, username, password }, ctx) => {
		try {
			/**
			 * TODO:
			 * Set this mail sending into utils folder
			 */

			// TODO: Logic on confirming user creation in mail
			let transport = nodemailer.createTransport({
				auth: {
					pass: process.env.OUTLOOK_PASSWORD,
					user: process.env.OUTLOOK_MAIL,
				},
				host: 'smtp-mail.outlook.com', // hostname
				port: 587, // port for secure SMTP
				secureConnection: false, // TLS requires secureConnection to be false
				tls: {
					ciphers: 'SSLv3',
				},
			});

			let message = {
				from: process.env.OUTLOOK_MAIL,
				html: '<p>HTML version of the message</p>',
				subject: 'Creating new user',
				// TODO: Add user info in body text
				text: 'Plain text version of the message',
				to: process.env.MAIN_EMAIL,
			};

			await transport.sendMail(message);

			return true;
		} catch (error) {
			return false;
		}

		// const hashedPassword = await hash(password, 10);

		// const user = await ctx.db.mutation.createUser({
		// 	data: {
		// 		name,
		// 		password: hashedPassword,
		// 		username,
		// 	},
		// });

		// return {
		// 	token: sign({ userId: user.id }, APP_SECRET),
		// 	user,
		// };
	},
};

module.exports = {
	Mutation,
};
