import React from 'react';
import { Route, Link } from 'react-router-dom';

import { Layout, Menu, Icon } from 'antd';
import SiteRoute from './Site/SiteRoute';
const { Sider } = Layout;

class Dashboard extends React.Component {
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
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
						<Menu.Item key="site">
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
					<Route exact path="/" render={SiteRoute} />
				</Layout>
			</Layout>
		);
	}
}

export default Dashboard;
