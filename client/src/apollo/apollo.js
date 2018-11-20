import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { from /* split */ } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { getMainDefinition } from 'apollo-utilities';

import { getTokenMiddleware, setTokenAfterware } from './tokenMiddleware';

const httpLink = new HttpLink({
	uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
});

const cache = new InMemoryCache();

const httpLinkWithMiddleware = from([getTokenMiddleware, setTokenAfterware.concat(httpLink)]);

export const client = new ApolloClient({
	cache,
	dataIdFromObject: o => o.id,
	link: httpLinkWithMiddleware,
});

export default client;
