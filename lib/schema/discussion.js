
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
	GraphQLEnumType
} = require('graphql')

const db = require('../db')
const UserType = require('./user')
const CommentType = require('./comment')

const _ = db._

const DiscussionStatusEnum = new GraphQLEnumType({
	name: 'DiscussionStatus',
	values: {
		OPEN: { value: 'open' },
		RESOLVED: { value: 'resolved' }
	}
})

/**
 * Export `Comment`
 */
module.exports = new GraphQLObjectType({
	name: 'Discussion',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			title: { type: new GraphQLNonNull(GraphQLString) },
			slug: { type: new GraphQLNonNull(GraphQLString) },
			createdAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: discussion => discussion.created_at
			},
			owner: {
				type: new GraphQLNonNull(UserType),
				resolve: discussion => {
					return db('users').find({ id: discussion.created_by })
				}
			},
			status: {
				type: new GraphQLNonNull(DiscussionStatusEnum)
			},
			excerpt: {
				type: GraphQLString,
				resolve: discussion => {
					const comment = discussion.comments[0]
					if (!comment) return
					return comment.contents
				}
			},
			lastUpdatedAt: {
				type: GraphQLString,
				resolve: discussion => {
					const comments = discussion.comments
					const comment = comments[comments.length - 1]
					if (!comment) return
					return comment.created_at
				}
			},
			participants: {
				type: new GraphQLList(UserType),
				resolve: discussion => {
					const users = db('users')
					const participants = _(discussion.comments).chain()
						.map('owner_id')
						.uniq()
						.map(id => users.find({ id }))
						.value()
					return participants
				}
			},
			comments: {
				type: new GraphQLList(CommentType),
			},
			commentCount: {
				type: GraphQLInt,
				resolve: discussion => discussion.comments.length || 0
			},
		}
	}
})
