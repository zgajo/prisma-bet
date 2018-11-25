const { Prisma } = require('prisma-binding');
const { resolvers } = require('./resolvers');

const fs = require('fs');

const typeDefs = fs.readFileSync(__dirname + '/schema/typeDefs.graphql', 'utf8');

// Exporting prisma, so that can be imported for  testing
const db = new Prisma({
	endpoint: `${process.env.PRISMA_SERVER}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${
		process.env.NODE_ENV
	}`,
	secret: process.env.PRISMA_API_SECRET,
	typeDefs: fs.readFileSync(__dirname + '/prisma-generated/prisma.graphql', 'utf8'),
});

module.exports = {
	context: request => {
		return {
			...request,
			db,
		};
	},
	db,
	resolvers,
	typeDefs,
};
