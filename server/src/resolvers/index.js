const { Query } = require('./Query');
const { Mutation } = require('./Mutation');

const resolvers = {
	Mutation,
	Query,
};

module.exports = {
	resolvers,
};
