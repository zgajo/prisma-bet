require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const { permissions } = require('./permissions');

const { context, resolvers, typeDefs } = require('./api');

const server = new GraphQLServer({
	context,
	middlewares: [permissions],
	resolvers,
	typeDefs,
});

server.start();
