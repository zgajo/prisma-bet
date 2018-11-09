const { context, resolvers, typeDefs, db } = require('./api');
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');

const runQuery = (query, variables = {}, ctx = {}) => {
	const schema = makeExecutableSchema({ resolvers, typeDefs });
	return graphql(schema, query, null, { ...context, ...ctx, db }, variables);
};

module.exports = {
	runQuery,
};
