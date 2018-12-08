// FIX for:
// Cannot redeclare block-scoped variable
// export {};

import { Prisma } from 'prisma-binding';
export { resolvers } from './resolvers';
import * as fs from 'fs';

export const typeDefs = fs.readFileSync(__dirname + '/schema/typeDefs.graphql', 'utf8');

// Exporting prisma, so that can be imported for  testing
export const db = new Prisma({
	endpoint: `${process.env.PRISMA_SERVER}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${
		process.env.NODE_ENV
	}`,
	secret: process.env.PRISMA_API_SECRET,
	typeDefs: fs.readFileSync(__dirname + '/prisma-generated/prisma.graphql', 'utf8'),
});

export const context = (request: any) => {
	return {
		...request,
		db,
	};
};
