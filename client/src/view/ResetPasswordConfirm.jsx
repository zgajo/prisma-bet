import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Form, Icon, Input, Button, Alert, message } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;

const forgotPasswordConfirmMutation = gql`
	mutation($password: String!, $password_confirm: String!, $resetPasswordToken: String!) {
		forgotPasswordConfirm(
			password: $password
			password_confirm: $password_confirm
			resetPasswordToken: $resetPasswordToken
		) {
			message
			success
		}
	}
`;

class ResetPassword extends Component {
	state = {};

	submit = mutation => e => {
		e.preventDefault();

		this.props.form.validateFields(async (err, values) => {
			if (err) return;

			const {
				params: { token },
			} = this.props.match;
			try {
				const response = await mutation({ variables: { ...values, resetPasswordToken: token } });

				const { message: msg, success } = response.data.forgotPasswordConfirm;

				if (success) {
					message.success(msg);

					setTimeout(() => {
						this.props.history.push('/login');
					}, 1000);
					return;
				}

				// if error, set error message
				this.setState({
					message: msg,
					success,
				});
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

	handleConfirmPassword = (rule, value, callback) => {
		const { getFieldValue } = this.props.form;
		if (value && value !== getFieldValue('password')) {
			callback('Passwords do not match!');
		}

		callback();
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Mutation mutation={forgotPasswordConfirmMutation}>
				{(forgotPasswordConfirm, { loading }) => (
					<div className="log-reg-page">
						<div className={'log-reg-container'}>
							<Form onSubmit={this.submit(forgotPasswordConfirm)}>
								<FormItem>
									{getFieldDecorator('password', {
										rules: [{ message: 'Please input your password!', required: true }],
									})(
										<Input
											prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
											placeholder="New password"
										/>,
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('password_confirm', {
										rules: [
											{
												message: 'Please input new password confirm!',
												required: true,
											},
											{ validator: this.handleConfirmPassword },
										],
									})(
										<Input
											prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
											placeholder="Confirm new password"
										/>,
									)}
								</FormItem>

								{this.state.message &&
									this.state.success === false && (
										<FormItem>
											<Alert message={this.state.message} type="error" showIcon />
										</FormItem>
									)}

								<FormItem>
									{loading ? (
										<Button type="primary" loading>
											Loading
										</Button>
									) : (
										<Button type="primary" htmlType="submit">
											Submit
										</Button>
									)}
								</FormItem>
								<FormItem>
									<ul className="app-list">
										<li>
											<Link to="/login">Back to login</Link>
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

const WrappedResetPassword = Form.create()(ResetPassword);

export default WrappedResetPassword;
