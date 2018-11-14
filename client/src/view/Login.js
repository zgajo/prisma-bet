import React, { Component } from 'react';
import injectSheet from 'react-jss';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Form, Icon, Input, Button, message } from 'antd';

const style = {
	login_container: {
		'align-items': 'center',
		background: '#fbfbfb',
		border: '1px solid #d9d9d9',
		'border-radius': '6px',
		display: 'flex',
		height: '350px',
		margin: 'auto',
		padding: '24px',
		width: '350px',
	},
	login_form: {
		width: '100%',
	},
	login_page: {
		background: 'url(background-form-login-1.png)',
		'background-size': 'cover',
		display: 'flex',
		height: '100%',
	},
};

const FormItem = Form.Item;

const login = gql`
	mutation($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			token
			user {
				id
				username
				name
			}
		}
	}
`;

class NormalLoginForm extends Component {
	errorMsg = msg => {
		message.error(msg);
	};

	warningMsg = msg => {
		message.warning(msg);
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		const { classes } = this.props;

		return (
			<Mutation mutation={login}>
				{login => (
					<div className={classes.login_page}>
						<div className={classes.login_container}>
							<Form
								onSubmit={e => {
									e.preventDefault();
									this.props.form.validateFields(async (err, values) => {
										if (err) return;

										try {
											const userLogin = await login({ variables: { ...values } });

											const { token } = userLogin.data.login;

											localStorage.setItem('authorization', token);
										} catch (error) {
											if (error.graphQLErrors && error.graphQLErrors) {
												error.graphQLErrors.forEach(({ message }) => {
													this.warningMsg(message);
												});
											}

											if (error.networkError) {
											}
										}
									});
								}}
								className={classes.login_form}
							>
								<FormItem>
									{getFieldDecorator('username', {
										rules: [{ message: 'Please input your username!', required: true }],
									})(
										<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />,
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('password', {
										rules: [{ message: 'Please input your Password!', required: true }],
									})(
										<Input
											prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
											type="password"
											placeholder="Password"
										/>,
									)}
								</FormItem>
								<FormItem>
									<Button type="primary" htmlType="submit">
										Login
									</Button>
								</FormItem>
							</Form>
						</div>
					</div>
				)}
			</Mutation>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default injectSheet(style)(WrappedNormalLoginForm);
