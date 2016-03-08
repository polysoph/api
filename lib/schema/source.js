
const {
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const url = require('url')

/**
 * Export `Avatar`
 */
module.exports = new GraphQLObjectType({
	name: 'Source',
	fields () {
		return {
			url: { type: GraphQLString },
			hostname: {
				type: GraphQLString,
				resolve: source => url.parse(source.url).hostname.replace(/^www\./, '')
			}
		}
	}
})
