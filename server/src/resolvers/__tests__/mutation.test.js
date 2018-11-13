const { runQuery } = require('../../runMockServer');

const { loginMutation, loginData } = require('./helpers');

describe('MUTATIONS', () => {
	describe('Login', () => {
		test('should be successful', async () => {
			const result = await runQuery(loginMutation, loginData);

			expect(result.data.login.token).not.toBeNull();
			expect(result.errors).toBeUndefined();
		});
		test('should fail on wrong username', async () => {
			const result = await runQuery(loginMutation, { ...loginData, username: 'dpranjic_Tests' });

			expect(result.data).toBeNull();
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toEqual('Invalid credentials');
		});
		test('should fail on wrong password', async () => {
			const result = await runQuery(loginMutation, { ...loginData, password: 'test la-la' });

			expect(result.data).toBeNull();
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toEqual('Invalid credentials');
		});
	});
});
