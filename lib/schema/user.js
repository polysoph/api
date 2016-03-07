
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const AvatarType = require('./avatar')

/**
 * Export `User`
 */
module.exports = new GraphQLObjectType({
	name: 'User',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			handle: { type: new GraphQLNonNull(GraphQLString) },
			institution: { type: GraphQLString },
			avatar: { type: AvatarType }
		}
	}
})
