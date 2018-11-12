const { context, resolvers, typeDefs, db } = require('./api');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('../node_modules/graphql-middleware/dist');
const { graphql } = require('graphql');

const { permissions } = require('./permissions');

const runQuery = (query, variables = {}, ctx = {}) => {
	const schema = makeExecutableSchema({ resolvers, typeDefs });

	const schemaWithMiddleware = applyMiddleware(schema, permissions);

	// sending prisma (db) to context because imported context is function which is resolver in graphql
	return graphql(schemaWithMiddleware, query, null, { ...context, ...ctx, db }, variables);
};

module.exports = {
	runQuery,
};
