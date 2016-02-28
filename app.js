
const koa = require('koa')
const mount = require('koa-mount')
const graphql = require('koa-graphql')
const compress = require('koa-compress')

const config = require('./lib/config')
const schema = require('./lib/schema')

module.exports = function (opts) {

	opts = opts || {}

	const app = koa()
	const api = graphql({ schema, pretty: config.api.pretty })

	app.use(compress())
	app.use(mount(config.api.endpoint, api))

	return app
}
