import React from 'react';
import { Route, Link } from 'react-router-dom';

import { Layout, Menu, Icon } from 'antd';
import SiteRoute from './Site/SiteRoute';
const { Sider } = Layout;

class Dashboard extends React.Component {
	state = {
		selected: 'main',
	};

	componentDidMount() {
		const newSite = this.fetchCurrentSite();

		if (this.state.selected !== newSite) {
			this.setState({
				selected: newSite,
			});
		}
	}

	componentDidUpdate() {
		const newSite = this.fetchCurrentSite();

		if (this.state.selected !== newSite) {
			this.setState({
				selected: newSite,
			});
		}
	}

	fetchCurrentSite() {
		const { pathname } = this.props.location;

		switch (true) {
			case pathname.includes('players'):
				return 'players';
			default:
				return 'main';
		}
	}

	render() {
		return (
			<Layout style={{ height: '100vh' }}>
				<Sider
					breakpoint="lg"
					collapsedWidth="0"
					onBreakpoint={broken => {
						/*eslint-disable */

						console.log(broken);
					}}
					onCollapse={(collapsed, type) => {
						console.log(collapsed, type);
						/*eslint-enable */
					}}
				>
					<Menu theme="dark" mode="inline" selectedKeys={[this.state.selected]}>
						<Menu.Item key="main">
							<Link to={'/'}>
								<Icon type="book" />
								<span>Klade</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="players">
							<Link to={`/players`}>
								<Icon type="user" />
								<span>Igrači</span>
							</Link>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout>
					<Route exact path="/players" render={() => 'Hell'} />
					<Route exact path="/" component={SiteRoute} />
				</Layout>
			</Layout>
		);
	}
}

export default Dashboard;
