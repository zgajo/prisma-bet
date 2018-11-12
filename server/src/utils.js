const { verify } = require('jsonwebtoken');

const APP_SECRET = 'appsecret321';

function getUserId(context) {
	const Authorization = context.request.headers.authorization;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const verifiedToken = verify(token, APP_SECRET);

		return verifiedToken && verifiedToken.userId;
	}
}

module.exports = {
	APP_SECRET,
	getUserId,
};
