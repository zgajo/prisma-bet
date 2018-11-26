import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;

const loginMutation = gql`
	mutation($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			success
			message
			token
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

	submit = mutation => e => {
		e.preventDefault();

		this.props.form.validateFields(async (err, values) => {
			if (err) return;

			try {
				const userLogin = await mutation({ variables: { ...values } });

				const { token, success } = userLogin.data.login;

				if (!success) return;

				localStorage.setItem('authorization', token);
				this.props.history.push('/');
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
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Mutation mutation={loginMutation}>
				{(login, { loading }) => (
					<div className="log-reg-page">
						<div className={'log-reg-container'}>
							<Form onSubmit={this.submit(login)}>
								<FormItem>
									{getFieldDecorator('username', {
										rules: [{ message: 'Please input your username!', required: true }],
									})(
										<Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />,
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
									<span className="display-flex">
										{loading ? (
											<Button type="primary" loading>
												Loading
											</Button>
										) : (
											<Button type="primary" htmlType="submit">
												Login
											</Button>
										)}

										<ul className="app-list">
											<li>
												<Link to="/register">Register</Link>
											</li>
										</ul>
									</span>
								</FormItem>
								<FormItem>
									<ul className="app-list">
										<li>
											<Link to="/reset_password">Forgot password?</Link>
										</li>
									</ul>
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

export default WrappedNormalLoginForm;
