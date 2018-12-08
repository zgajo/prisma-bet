import * as dotenv from 'dotenv';
dotenv.config();

import { GraphQLServer } from 'graphql-yoga';
import { permissions } from './permissions';

import { context, resolvers, typeDefs } from './api';

const server = new GraphQLServer({
	context,
	middlewares: [permissions],
	resolvers,
	typeDefs,
});

// TODO: add audit

const serverOptions = {
	debug: true,
	endpoint: '/graphql',
	playground: '/docs',
	port: 4000,
	tracing: true,
};

server.start(serverOptions);
