import decode from 'jwt-decode';

export const isAuth = () => {
	try {
		const token = localStorage.getItem('authorization');

		const t = decode(token);
		const { exp } = t;
		const currentTime = new Date().getTime() / 1000;

		// Token expired
		if (exp < currentTime) {
			localStorage.removeItem('authorization');
			return false;
		}

		return true;
	} catch (error) {
		localStorage.removeItem('authorization');
		return false;
	}
};

export const readUser = () => {
	const token = localStorage.getItem('authorization');

	const { name } = decode(token);
	return name;
};
