/**
 * TODO:
 * Remove eslint comment
 */
// eslint-disable-next-line
const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { APP_SECRET } = require('../utils');
const path = require('path');

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
				attachments: [
					{
						cid: 'authorization_img',
						contentDisposition: 'inline',
						filename: 'email-authorization.jpg',
						path: path.join(__dirname, '/images/email-authorization.jpg'),
					},
				],
				from: process.env.OUTLOOK_MAIL,
				html: `
				<table align="center"  cellpadding="0" cellspacing="0" width="600">
					<tr>
						<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
							<img src="cid:authorization_img" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
						</td>
					</tr>
					<tr>
						<td bgcolor="#ffffff" style="padding: 10px">
							Authorization needed for user: ${name}
						</td>
					</tr>
					<tr>
						<td bgcolor="#ffffff" style="padding: 10px">
							<a href="${process.env.CLIENT_URL}/authorize_users">Respond</a>
						</td>
					</tr>
				</table>
				`,
				subject: 'Creating new user',
				// TODO: Add user info in body text
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
