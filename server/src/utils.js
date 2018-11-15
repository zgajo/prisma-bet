const { verify } = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

const APP_SECRET = 'appsecret321';

function getUser(context) {
	const Authorization = context && context.request && context.request.headers && context.request.headers.authorization;

	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const verifiedToken = verify(token, APP_SECRET);

		return verifiedToken && verifiedToken.userId && verifiedToken.name && verifiedToken;
	}
}

function setupMail() {
	return nodemailer.createTransport({
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
}

async function sendNewUserMail(name, email) {
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
		// server from which is mail sent
		html: `
		<table align="center"  cellpadding="0" cellspacing="0" width="600">
			<tr>
				<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
					<img src="cid:authorization_img" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
				</td>
			</tr>
			<tr>
				<td bgcolor="#ffffff" style="padding: 10px">
					Authorization needed for user: ${name} (email: ${email})
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
		to: process.env.MAIN_EMAIL,
	};

	let transport = setupMail();

	try {
		const response = await transport.sendMail(message);

		return Promise.resolve(response);
	} catch (error) {
		// TODO: Return object which will tell that email is the error
		return Promise.reject(error);
	}
}

module.exports = {
	APP_SECRET,
	getUser,
	sendNewUserMail,
};
