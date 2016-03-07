
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const db = require('../db')
const UserType = require('./user')

/**
 * Export `Comment`
 */
module.exports = new GraphQLObjectType({
	name: 'Comment',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			createdAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: comment => comment.created_at
			},
			owner: {
				type: new GraphQLNonNull(UserType),
				resolve: comment => {
					return db('users').find({ id: comment.owner_id })
				}
			},
			contents: { type: new GraphQLNonNull(GraphQLString) }
		}
	}
})
