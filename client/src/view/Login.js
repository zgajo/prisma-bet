import React, { Component } from 'react';
import injectSheet from 'react-jss';

import { Form, Icon, Input, Button } from 'antd';

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
		'background-size': 'contain',
		display: 'flex',
		height: '100%',
	},
};

const FormItem = Form.Item;

class NormalLoginForm extends Component {
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				/*eslint-disable */

				console.log('Received values of form: ', values);
			}
			console.log(err);
			/*eslint-enable */
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		const { classes } = this.props;

		return (
			<div className={classes.login_page}>
				<div className={classes.login_container}>
					<Form onSubmit={this.handleSubmit} className={classes.login_form}>
						<FormItem>
							{getFieldDecorator('userName', {
								rules: [{ message: 'Please input your username!', required: true }],
							})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
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
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default injectSheet(style)(WrappedNormalLoginForm);
