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

const serverOptions = {
	debug: true,
	endpoint: '/graphql',
	playground: '/docs',
	port: 5000,
	tracing: true,
};

server.start(serverOptions);
