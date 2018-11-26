const nodemailer = require('nodemailer');
const path = require('path');

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

async function sendNewUserMail(name, email, id) {
	let message = {
		attachments: [
			{
				cid: 'authorization_img',
				contentDisposition: 'inline',
				filename: 'email-authorization.jpg',
				path: path.join(__dirname, '/../images/email-authorization.jpg'),
			},
		],
		from: process.env.OUTLOOK_MAIL,
		// server from which is mail sent
		html: `
		<table align="center"  cellpadding="0" cellspacing="0" width="600">
			<tr>
				<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
					<img src="cid:authorization_img" alt="Creating New User" height="300" style="display: block;" />
				</td>
			</tr>
			<tr>
				<td bgcolor="#ffffff" style="padding: 10px">
					Authorization needed for user: ${name} (email: ${email})
				</td>
			</tr>
			<tr>
				<td bgcolor="#ffffff" style="padding: 10px">
					<a href="${process.env.CLIENT_URL}/authorize_users/edit/${id}">Respond</a>
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
		return Promise.reject({
			errorType: 'email',
			message: 'There was a problem with sending email to admin, please try to sign up little later',
		});
	}
}

const resetTokenMail = async (user, token) => {
	let message = {
		attachments: [
			{
				cid: 'authorization_img',
				contentDisposition: 'inline',
				filename: 'email-authorization.jpg',
				path: path.join(__dirname, '/../images/email-authorization.jpg'),
			},
		],
		from: process.env.OUTLOOK_MAIL,
		// server from which is mail sent
		html: `
		<table align="center"  cellpadding="0" cellspacing="0" width="600">
			<tr>
				<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0;">
					<img src="cid:authorization_img" alt="Password reset" height="300" style="display: block;" />
				</td>
			</tr>
			<tr>
				<td bgcolor="#ffffff" style="padding: 10px">
					Hello ${user.name},<br /><br />
					You are receiving this email because you (or someone else) have requested reset of the password of your account. <br />
					Please click on the folowing link to complete the proccess within one hour of receiving it: <br />
					If you didn't request this, please ignore this email and your password will remain unchanged
				</td>
			</tr>
			<tr>
				<td bgcolor="#ffffff" style="padding: 10px">
					<a href="${process.env.CLIENT_URL}/resetPassword/${token}">Respond</a>
				</td>
			</tr>
		</table>
		`,
		subject: 'Confirm password reset',
		to: user.email,
	};

	let transport = setupMail();

	try {
		const response = await transport.sendMail(message);

		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject({
			errorType: 'email',
			message: 'There was a problem with sending email, please try little later',
		});
	}
};

async function sendEmailNewUserToAdmin(name, email) {
	// On if we get less than 3 errors, try to send message again
	let errorCount = 0;
	let successful = false;
	let response = null;

	do {
		try {
			response = await sendNewUserMail(name, email);
			successful = true;
		} catch (error) {
			successful = false;
			++errorCount;
			response = error;
		}
	} while (errorCount < 3 && !successful);

	if (response.errorType === 'email') return Promise.reject(response);
	return Promise.resolve(response);
}

module.exports = {
	resetTokenMail,
	sendEmailNewUserToAdmin,
};
