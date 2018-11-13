const { verify } = require('jsonwebtoken');

const APP_SECRET = 'appsecret321';

function getUser(context) {
	const Authorization = context && context.request && context.request.headers && context.request.headers.authorization;

	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const verifiedToken = verify(token, APP_SECRET);

		return verifiedToken && verifiedToken.userId && verifiedToken.name && verifiedToken;
	}
}

module.exports = {
	APP_SECRET,
	getUser,
};
