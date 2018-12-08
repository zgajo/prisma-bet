const { Query } = require('./Query');
const { Mutation } = require('./Mutation');

const resolvers = {
	// Need to add __resolveType for interface to remove warning
	AuthPayload: {
		__resolveType() {
			return;
		},
	},
	Mutation,
	Query,
};

module.exports = {
	resolvers,
};
