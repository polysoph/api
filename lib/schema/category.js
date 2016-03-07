
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

/**
 * Export `Category`
 */
module.exports = new GraphQLObjectType({
	name: 'Category',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			title: { type: new GraphQLNonNull(GraphQLString) },
			slug: { type: new GraphQLNonNull(GraphQLString) }
		}
	}
})
