const { verify } = require('jsonwebtoken');
const APP_SECRET = 'appsecret321';

function getUser(context) {
	const Authorization = context && context.request && context.request.headers && context.request.headers.authorization;

	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const verifiedToken = verify(token, APP_SECRET);

		return verifiedToken && verifiedToken.id;
	}
}

function tokenCreationData(user) {
	return {
		id: user.id,
		isAdmin: user.admin,
		name: user.name,
	};
}

module.exports = {
	APP_SECRET,
	getUser,
	tokenCreationData,
};
