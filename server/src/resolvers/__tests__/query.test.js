const { runQuery } = require('../../runMockServer');
const { expToken, meQuery, usersQuery, loginMutation, loginData, setup } = require('./helpers');

describe('QUERY', () => {
	describe('Token', () => {
		let token;
		beforeAll(async () => {
			const okLogin = await runQuery(loginMutation, { ...loginData });
			token = okLogin && okLogin.data && okLogin.data.login && okLogin.data.login.token;
		});

		test('should return new token if current is valid', async () => {
			const { request, response } = setup();

			request.headers.authorization = 'Bearer ' + token;

			await runQuery(
				meQuery,
				{},
				{
					request,
					response, // If authorization is successful, it will return new token
				},
			);

			expect(response.get('authorization')).not.toBe(token);
		});

		test('should return "Not Authorised!" if token is not valid', async () => {
			const { request, response } = setup();

			request.headers.authorization = 'Bearer ' + expToken;

			const result = await runQuery(
				meQuery,
				{},
				{
					request,
					response, // If authorization is successful, it will return new token
				},
			);

			expect(result.data.me).toBeNull();
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0].message).toBe('Not Authorised!');
		});
	});

	test('should return 2 users', async () => {
		const result = await runQuery(usersQuery);

		expect(result.data).not.toBeNull();
		expect(result.data.users).toBeInstanceOf(Array);
		expect(result.data.users.length).toBeGreaterThan(1);
	});

	test('should return logged user', async () => {
		const okLogin = await runQuery(loginMutation, { ...loginData });
		const token = okLogin && okLogin.data && okLogin.data.login && okLogin.data.login.token;
		const { request, response } = setup();

		request.headers.authorization = 'Bearer ' + token;

		const result = await runQuery(
			meQuery,
			{},
			{
				request,
				response, // If authorization is successful, it will return new token
			},
		);

		expect(result.data.me).not.toBeNull();
		expect(result.errors).toBeUndefined();
		expect(result.data.me.username).toEqual(loginData.username);
	});
});
