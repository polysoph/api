
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
const ActionType = require('./action')
const CommentType = require('./comment')

const DiscussionEntity = require('./union/entity')

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
			timeline: {
				type: new GraphQLList(DiscussionEntity),
				resolve: discussion => {
					const actionIDs = discussion.timeline
						.filter(t => t.type === 'action')
						.map(action => action.ref)
					const actions = db('questions').chain()
						.map('actions')
						.compact()
						.flatten()
						.value()
					const artifacts = db('questions').chain()
						.map('artifacts')
						.compact()
						.flatten()
						.value()
					const comments = discussion.comments
					const timeline = discussion.timeline.map(obj => {
						if (obj.type === 'comment') {
							return comments.find(comment => comment.id === obj.ref)
						}
						if (obj.type === 'artifact') {
							return artifacts.find(artifact => artifact.id === obj.ref)
						}
						return actions.find(action => action.id === obj.ref)
					})
					return timeline
				}
			},
			actions: {
				type: new GraphQLList(ActionType),
				resolve: discussion => {
					const actionIDs = discussion.timeline
						.filter(t => t.type === 'action')
						.map(action => action.ref)
					const actions = db('questions').chain()
						.map('actions')
						.compact()
						.flatten()
						.intersectionBy(actionIDs, 'id')
						.value()
					return actions
				}
			},
			entities: {
				type: new GraphQLList(GraphQLString),
				resolve: (discussion, b, c) => {
					const refs = discussion.timeline
					return refs.map(ref => ref.type)
				}
			},
			comments: {
				type: new GraphQLList(CommentType),
			},
			firstComment: {
				type: CommentType,
				resolve: discussion => discussion.comments && discussion.comments[0]
			},
			commentCount: {
				type: GraphQLInt,
				resolve: discussion => discussion.comments.length || 0
			},
		}
	}
})
