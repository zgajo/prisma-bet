const { runQuery } = require('../../runMockServer');

const query = `
	{
		users {
			id
		}
	}
`;

describe('Query', () => {
	test('should return minimum 2 users', async () => {
		const result = await runQuery(query);

		expect(result.data).not.toBeNull();
		expect(result.data.users).toBeInstanceOf(Array);
		expect(result.data.users.length).toBeGreaterThan(1);
	});
});
