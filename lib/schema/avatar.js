
const {
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

/**
 * Export `avatar`
 */
module.exports = new GraphQLObjectType({
	name: 'Avatar',
	fields () {
		return {
			url: { type: GraphQLString }
		}
	}
})
