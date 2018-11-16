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

//TODO: add audit

const serverOptions = {
	debug: true,
	endpoint: '/graphql',
	playground: '/docs',
	port: 4000,
	tracing: true,
};

server.start(serverOptions);
