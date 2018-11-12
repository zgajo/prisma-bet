const { runQuery } = require('../../runMockServer');

const loginData = `
mutation($username:String!, $password:String!){
	login(username: $username, password:$password){
	  token
	  user{
		id
		username
		name
	  }
	}
  }
`;

describe('Mutations', () => {
	describe('Login', () => {
		test('should be successful', async () => {
			const result = await runQuery(loginData, { password: 'test', username: 'dpranjic_Test' });

			expect(result.data.login.token).not.toBeNull();
			expect(result.errors).toBeUndefined();
		});
		test('should fail on wrong username', async () => {
			const result = await runQuery(loginData, { password: 'test', username: 'dpranjic_Tests' });

			expect(result.data).toBeNull();
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toEqual('Invalid credentials');
		});
		test('should fail on wrong password', async () => {
			const result = await runQuery(loginData, { password: 'test la-la', username: 'dpranjic_Test' });

			expect(result.data).toBeNull();
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toEqual('Invalid credentials');
		});
	});
});
