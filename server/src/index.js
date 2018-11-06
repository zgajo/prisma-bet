require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const { resolvers } = require('./resolvers');
const { permissions } = require('./permissions');

const server = new GraphQLServer({
	context: request => {
		return {
			...request,
			db: new Prisma({
				endpoint: `http://localhost:4466`,
				typeDefs: 'src/prisma-generated/prisma.graphql',
			}),
		};
	},
	middlewares: [permissions],
	resolvers,
	typeDefs: 'src/schema/typeDefs.graphql',
});

server.start();
