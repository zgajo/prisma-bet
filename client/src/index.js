import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import './style.scss';

import * as serviceWorker from './serviceWorker';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'import { Layout, Menu, Icon } from 'antd';
import { MainRouter } from './router';
import client from './apollo/apollo';

const mountNode = document.getElementById('root');

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<MainRouter />
		</Router>
	</ApolloProvider>,
	mountNode,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
