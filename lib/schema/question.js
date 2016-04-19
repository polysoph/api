
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
const KeywordType = require('./keyword')
const DiscussionType = require('./discussion')
const MilestoneType = require('./milestone')
const ArtifactType = require('./artifact')
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
			status: { type: GraphQLString },

			keywords: {
				type: new GraphQLList(KeywordType),
				resolve: question => {
					if (!question.keywords) return []
					return question.keywords.map(id => db('keywords').find({ id }))
				}
			},

			comments: {
				type: new GraphQLList(CommentType)
			},
			discussions: {
				type: new GraphQLList(DiscussionType),
				resolve: question => {
					const discussions = question.discussions
						.concat().sort(sortByLastUpdated)
					return discussions
				}
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
			milestones: {
				type: new GraphQLList(MilestoneType)
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
				resolve: question => {
					return question.milestones.length ? question.milestones.length : 0
				}
			},
			followerCount: {
				type: GraphQLInt,
				resolve: question => question.metrics.followers
			},
			citationCount: {
				type: GraphQLInt,
				resolve: question => question.metrics.citations
			},

			createdAt: {
				type: GraphQLString,
				resolve: question => {
					const commentDates = _(question.discussions)
						.map('comments')
						.flatten()
						.map('created_at')
						.value()
					const sorted = commentDates.sort(sortByDate)
					return _(sorted).last()
				}
			},

			lastUpdatedAt: {
				type: GraphQLString,
				resolve: question => {
					const commentDates = _(question.discussions)
						.map('comments')
						.flatten()
						.map('created_at')
						.value()
					const sorted = commentDates.sort(sortByDate)
					return _(sorted).first()
				}
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
			 *
			 */
			artifacts: {
				type: new GraphQLList(ArtifactType)
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

			people: {
				type: new GraphQLList(UserType),
				resolve: question => {
					const users = db('users')
					const ownerIDs = _(question.owners)
						.map('user_id')
						.value()
					const contributorIDs = _(question.discussions)
						.map('comments')
						.flatten()
						.map('owner_id')
						.value()
					const people = _(ownerIDs)
						.concat(contributorIDs)
						.uniq()
						.map(id => users.find({ id }))
						.value()
					return people
				}
			},

			hasMilestonesEnabled: {
				type: GraphQLBoolean,
				resolve: question => question.config.milestones !== false
			},
			hasTasksEnabled: {
				type: GraphQLBoolean,
				resolve: question => question.config.tasks !== false
			}
		}
	}
})

/**
 * Helper functions
 */

function sortByDate (a, b) {
	const dateA = new Date(a)
	const dateB = new Date(b)
	return dateB - dateA
}

function sortByLastUpdated (a, b) {
	const lastUpdatedA = _(a.comments).last()
	const lastUpdatedB = _(b.comments).last()
	const dateA = new Date(lastUpdatedA.created_at)
	const dateB = new Date(lastUpdatedB.created_at)
	return dateB - dateA
}
// const comments = discussion.comments
// const comment = comments[comments.length - 1]
// if (!comment) return
// return comment.created_at
