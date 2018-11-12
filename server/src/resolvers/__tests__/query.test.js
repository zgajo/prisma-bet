const { runQuery } = require('../../runMockServer');
/**
 * TODO:
 * Remove queries and reused data to seperate helper module
 */
// expired token
const expToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjam9lZjNsZjgwMDA5MDk3MHFsdW0wbnF3IiwiaWF0IjoxNTQyMDQxMjA1LCJleHAiOjE1NDIwNDEyNjV9.RAbSlzR3kDThmxRduWVDRyzDKhz9Auiy4IskJ5XgckQ';

const query = `
	{
		users {
			id
		}
	}
`;

const meQuery = `
{
	me{
	  id
	  username
	  name
	}
  }
`;

describe('Query', () => {
	test('should return 2 users', async () => {
		const result = await runQuery(query);

		expect(result.data).not.toBeNull();
		expect(result.data.users).toBeInstanceOf(Array);
		expect(result.data.users.length).toBeGreaterThan(1);
	});

	test('should return "Not Authorised!" if token is not valid', async () => {
		const result = await runQuery(
			meQuery,
			{},
			/**
			 * TODO:
			 * make mock functions from request and response
			 */
			{
				request: {
					headers: {
						authorization: 'Bearer ' + expToken,
					},
				},
				response: new Map(), // If authorization is successful, it will return new token
			},
		);

		expect(result.data.me).toBeNull();
		expect(result.errors.length).toBeGreaterThan(0);
		expect(result.errors[0].message).toBe('Not Authorised!');
	});

	test('should return user', async () => {
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

		const testData = { password: 'test', username: 'dpranjic_Test' };

		const okLogin = await runQuery(loginData, { ...testData });

		const result = await runQuery(
			meQuery,
			{},
			{
				request: {
					headers: {
						authorization: 'Bearer ' + okLogin.data.login.token,
					},
				},
				response: new Map(), // If authorization is successful, it will return new token
			},
		);

		expect(result.data.me).not.toBeNull();
		expect(result.errors).toBeUndefined();
		expect(result.data.me.username).toEqual(testData.username);
	});
});
