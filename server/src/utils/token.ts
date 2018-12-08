import { verify } from 'jsonwebtoken';
export const APP_SECRET = 'appsecret321';

interface Context {
	request: {
		headers: {
			authorization: string;
		};
	};
}

interface UserData {
	id: string;
	name: string;
	admin: string;
}

export function getUser(context: Context) {
	const Authorization = context && context.request && context.request.headers && context.request.headers.authorization;

	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const verifiedToken = verify(token, APP_SECRET);

		return verifiedToken;
	}

	return undefined;
}

export function tokenCreationData(user: UserData) {
	return {
		id: user.id,
		isAdmin: user.admin,
		name: user.name,
	};
}
