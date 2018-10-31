require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const resolvers = require('./resolvers');

const server = new GraphQLServer({
	prisma: new Prisma({
		endpoint: `${process.env.PRISMA_SERVER}:${process.env.PRISMA_PORT}`,
		typeDefs: 'src/prisma-generated/prisma.graphql',
	}),
	resolvers,
	typeDefs: 'src/schema/typeDefs.graphql',
});

server.start();
