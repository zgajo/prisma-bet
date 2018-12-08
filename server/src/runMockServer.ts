import { context, resolvers, typeDefs, db } from './api';
import { makeExecutableSchema } from '../node_modules/graphql-tools/dist';
import { applyMiddleware } from '../node_modules/graphql-middleware/dist';
import { graphql } from 'graphql';

import { permissions } from './permissions';

export const runQuery = (query: any, variables = {}, ctx = {}) => {
	const schema = makeExecutableSchema({ resolvers, typeDefs });

	const schemaWithMiddleware = applyMiddleware(schema, permissions);

	// sending prisma (db) to context because imported context is function which is resolver in graphql
	return graphql(schemaWithMiddleware, query, null, { ...context, ...ctx, db }, variables);
};
