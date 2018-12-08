import { rule, shield, and } from 'graphql-shield';
import { sign } from 'jsonwebtoken';
import { getUser, APP_SECRET, tokenCreationData } from '../utils/token';

const rules = {
	isAdmin: rule()(async (_, __, ctx) => {
		const user: any = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid && user !== undefined) {
			const userAdmin = await ctx.db.query.user({ where: { id: user.id } });

			return userAdmin.admin ? true : false;
		}

		return false;
	}),
	isAuthenticated: rule()((_, __, ctx) => {
		const user: any = getUser(ctx);
		const userIdValid = !!user;

		if (userIdValid) {
			// Giving client accessibility to authorization header
			ctx.response.set('Access-Control-Expose-Headers', 'authorization');

			ctx.response.set(
				'authorization',
				sign(
					{
						// change iat only if we're in  test enviroment
						// Doing this because if test token is issued at same second as this creation, it will generate same token and test will break
						...(process.env.NODE_ENV === 'test' && { iat: (new Date() as any) - 1 }),
						...tokenCreationData(user),
					},
					APP_SECRET,
					{
						expiresIn: '1h',
					},
				),
			);
		}

		return userIdValid;
	}),
};

export const permissions = shield({
	Mutation: {
		responseWaitingUser: and(rules.isAuthenticated, rules.isAdmin),
	},
	Query: {
		me: rules.isAuthenticated,
		waitingUsers: and(rules.isAuthenticated, rules.isAdmin),
	},
});
