const { context, resolvers, typeDefs, db } = require('./api');
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');

const runQuery = (query, variables = {}, ctx = {}) => {
	const schema = makeExecutableSchema({ resolvers, typeDefs });

	/** TODO:
	const schema = makeExecutableSchema({ typeDefs, resolvers })

	const schemaWithMiddleware = applyMiddleware(
		schema,
		metricsMiddleware,
		authMiddleware,
		beepMiddleware,
	)
	 */

	// sending prisma (db) to context because imported context is function which is resolver in graphql
	return graphql(schema, query, null, { ...context, ...ctx, db }, variables);
};

module.exports = {
	runQuery,
};
