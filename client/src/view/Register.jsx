import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;

const signupMutation = gql`
	mutation($email: String!, $name: String!, $password: String!, $username: String!) {
		signup(name: $name, username: $username, password: $password, email: $email) {
			success
			message
		}
	}
`;

class NormalRegisterForm extends Component {
	errorMsg = msg => {
		message.error(msg);
	};

	warningMsg = msg => {
		message.warning(msg);
	};

	successMsg = msg => {
		message.success(msg);
	};

	submit = mutation => e => {
		e.preventDefault();

		this.props.form.validateFields(async (err, values) => {
			if (err) return;

			try {
				const userSignup = await mutation({ variables: { ...values } });

				const { success, message } = userSignup.data.signup;

				if (!success) {
					// Show error
					return this.errorMsg(message);
				}

				this.successMsg(message);
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
			<Mutation mutation={signupMutation}>
				{(signup, { loading }) => (
					<div className="log-reg-page">
						<div className={'log-reg-container'}>
							<Form onSubmit={this.submit(signup)}>
								<FormItem>
									{getFieldDecorator('email', {
										rules: [{ message: 'Please input your email!', required: true }],
									})(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('name', {
										rules: [{ message: 'Please input your name!', required: true }],
									})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Name" />)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('username', {
										rules: [{ message: 'Please input your username!', required: true }],
									})(
										<Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />,
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('password', {
										rules: [{ message: 'Please input your Password!', required: true }, { min: 6 }, { max: 20 }],
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
												Register
											</Button>
										)}

										<ul className="app-list">
											<li>
												<Link to="/login">Login</Link>
											</li>
										</ul>
									</span>
								</FormItem>
							</Form>
						</div>
					</div>
				)}
			</Mutation>
		);
	}
}

const RegisterForm = Form.create()(NormalRegisterForm);

export default RegisterForm;
