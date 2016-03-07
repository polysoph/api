
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean
} = require('graphql')

const db = require('../db')
const CategoryType = require('./category')
const CommentType = require('./comment')
const DiscussionType = require('./discussion')
const MilestoneType = require('./milestone')
const UserType = require('./user')

const _ = db._

/**
 * Export `Question`
 */
module.exports = new GraphQLObjectType({
	name: 'Question',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			title: { type: new GraphQLNonNull(GraphQLString) },
			slug: { type: new GraphQLNonNull(GraphQLString) },
			category: {
				type: new GraphQLNonNull(CategoryType),
				resolve: question => db('categories').find({ id: question.category })
			},
			summary: { type: GraphQLString },
			description: { type: GraphQLString },
			comments: {
				type: new GraphQLList(CommentType)
			},
			discussions: {
				type: new GraphQLList(DiscussionType)
			},
			discussion: {
				type: DiscussionType,
				args: {
					id: { name: 'id', type: GraphQLInt },
					slug: { name: 'slug', type: GraphQLString }
				},
				resolve: (question, args) => {
					if (args.slug) {
						return question.discussions.find(d => d.slug === args.slug)
					}
					return question.discussions.find(d => d.id === args.id)
				}
			},
			milestone: {
				type: MilestoneType,
				args: {
					id: { type: GraphQLInt }
				},
				resolve: (question, args) => question.milestones.find(m => m.id === args.id)
			},
			milestoneCount: {
				type: GraphQLInt,
				resolve: question => question.milestones.length
			},
			followerCount: {
				type: GraphQLInt,
				resolve: question => question.metrics.followers
			},
			citationCount: {
				type: GraphQLInt,
				resolve: question => question.metrics.citations
			},
			owners: {
				type: new GraphQLList(UserType),
				resolve: question => {
					const users = db('users')
					const owners = db._(question.owners).chain()
						.map('user_id')
						.uniq()
						.map(id => users.find({ id }))
						.value()
					return owners
				}
			},

			/**
			 * An array of all forms of contribution (artifacts, comments, etc) to a
			 * given question
			 *
			 * NB: Currently, this only aggregates comments
			 */
			contributions: {
				type: new GraphQLList(CommentType),
				resolve: question => {
					const aggregated = question.discussions
						.map(d => d.comments)
						.reduce((arr, comments) => arr.concat(comments), [])
					return aggregated
				}
			},

			contributors: {
				type: new GraphQLList(UserType),
				resolve: question => {
					const users = db('users')
					const owners = _(question.owners).map('user_id').value()
					const contributors = _(question.discussions)
						.map('comments')
						.flatten()
						.map('owner_id')
						.uniq()
						.map(id => users.find({ id }))
						.filter(user => owners.indexOf(user.id) === -1)
						.value()
					return contributors
				}
			},
			contributorCount: {
				type: GraphQLInt,
				resolve: question => {
					const users = db('users')
					return _(question.comments).chain()
						.map('user_id')
						.uniq()
						.size()
				}
			},
			hasMilestonesEnabled: {
				type: GraphQLBoolean,
				resolve: question => question.config.milestones || true
			},
			hasTasksEnabled: {
				type: GraphQLBoolean,
				resolve: question => question.config.tasks || true
			}
		}
	}
})
