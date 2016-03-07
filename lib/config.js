
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 5250

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = env
}

module.exports = {
	env,
	port,

	api: {
		endpoint: '/v0',
		pretty: true,
		cors: {
			origin: true,
			credentials: true	
		}
	},

	paths: {
		root: require('app-root-path')
	}
}
