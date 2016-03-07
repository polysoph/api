
const {
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

/**
 * Export `Avatar`
 */
module.exports = new GraphQLObjectType({
	name: 'Avatar',
	fields () {
		return {
			url: { type: GraphQLString }
		}
	}
})
