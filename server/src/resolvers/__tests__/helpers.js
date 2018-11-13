// expired token
const expToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjam9lZjNsZjgwMDA5MDk3MHFsdW0wbnF3IiwiaWF0IjoxNTQyMDQxMjA1LCJleHAiOjE1NDIwNDEyNjV9.RAbSlzR3kDThmxRduWVDRyzDKhz9Auiy4IskJ5XgckQ';

const usersQuery = `
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

const loginMutation = `
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

const loginData = { password: 'test', username: 'dpranjic_Test' };

function setup() {
	return {
		request: {
			headers: {},
		},
		response: new Map(),
	};
}

module.exports = {
	expToken,
	loginData,
	loginMutation,
	meQuery,
	setup,
	usersQuery,
};
