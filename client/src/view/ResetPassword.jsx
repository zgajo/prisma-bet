import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;

const forgotPasswordMutation = gql`
	mutation($email: String!) {
		forgotPassword(email: $email) {
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

			try {
				const response = await mutation({ variables: { ...values } });

				const { message, success } = response.data.forgotPassword;

				this.setState({
					message,
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

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Mutation mutation={forgotPasswordMutation}>
				{(forgotPassword, { loading }) => (
					<div className="log-reg-page">
						<div className={'log-reg-container'}>
							<Form onSubmit={this.submit(forgotPassword)}>
								<FormItem>
									{getFieldDecorator('email', {
										rules: [{ message: 'Please input your username!', required: true }],
									})(<Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
								</FormItem>

								{this.state.message &&
									this.state.success && (
										<FormItem>
											<Alert message={this.state.message} type="success" showIcon />
										</FormItem>
									)}
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
