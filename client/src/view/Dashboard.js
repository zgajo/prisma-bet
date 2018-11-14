import React from 'react';
import { Route, Link } from 'react-router-dom';
import injectSheet from 'react-jss';

import { Layout, Menu, Icon, Avatar } from 'antd';
import SiteRoute from './Site/SiteRoute';
import { readUser } from '../helpers/token';
const { Sider } = Layout;

const style = {
	dash_user: {
		color: 'white',
		height: '40px',
		'line-height': '40px',
		padding: '0px 10px',
	},
	float_left: {
		float: 'left',
	},
	float_right: {
		cursor: 'pointer',
		float: 'right',
	},
};

class Dashboard extends React.Component {
	state = {
		selected: 'main',
	};

	componentDidMount() {
		this.fetchCurrentSite();
	}

	componentDidUpdate() {
		this.fetchCurrentSite();
	}

	fetchCurrentSite() {
		const { pathname } = this.props.location;

		function getUrl() {
			switch (true) {
				case pathname.includes('players'):
					return 'players';
				default:
					return 'main';
			}
		}

		const newSite = getUrl();

		if (this.state.selected !== newSite) {
			this.setState({
				selected: newSite,
			});
		}
	}

	logout = () => {
		localStorage.removeItem('authorization');

		this.props.history.push('/login');
	};

	render() {
		const { classes } = this.props;

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
					<div className={classes.dash_user}>
						<span className={classes.float_left}>
							<Avatar icon="user" /> {readUser()}
						</span>
						<span className={classes.float_right}>
							<Icon type="logout" onClick={this.logout} />
						</span>
					</div>
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

export default injectSheet(style)(Dashboard);
