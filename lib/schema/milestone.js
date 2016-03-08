
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
	name: 'Milestone',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			createdAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: milestone => milestone.created_at
			},
			title: { type: new GraphQLNonNull(GraphQLString) },
			owner: {
				type: new GraphQLNonNull(UserType),
				resolve: milestone => {
					return db('users').find({ id: milestone.owner_id })
				}
			},
			contents: { type: new GraphQLNonNull(GraphQLString) },
			commentCount: {
				type: new GraphQLNonNull(GraphQLInt),
				resolve: milestone => milestone.comments
			},
			viewCount: {
				type: new GraphQLNonNull(GraphQLInt),
				resolve: milestone => milestone.views
			}
		}
	}
})
