
const {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} = require('graphql')

const db = require('./db')
const UserType = require('./schema/user')
const QuestionType = require('./schema/question')
const CategoryType = require('./schema/category')

const query = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({

		/**
		 * Health-check
		 *
		 * @returns String
		 */
		ping: {
			type: GraphQLString,
			resolve: () => 'pong'
		},

		/**
		 * Get all categories
		 */
		categories: {
			type: new GraphQLList(CategoryType),
			resolve: (root, args) => db('categories').values()
		},

		/**
		 * Get category by attribute
		 */
		category: {
			type: CategoryType,
			resolve: (root, args) => db('categories').find(args)
		},

		/**
		 * Get all users
		 */
		users: {
			type: new GraphQLList(UserType),
			resolve: (root, args) => db('users').values()
		},

		/**
		 * Get user by `id` or by `name`
		 */
		user: {
			type: UserType,
			args: {
				id: { name: 'id', type: GraphQLInt },
				name: { name: 'name', type: GraphQLString },
				handle: { name: 'slug', type: GraphQLString }
			},
			resolve: (root, args) => db('users').find(args)
		},

		/**
		 * Get all questions
		 */
		questions: {
			type: new GraphQLList(QuestionType),
			resolve: (root, args) => db('questions').values()
		},

		/**
		 * Get question by attribute
		 */
		question: {
			type: QuestionType,
			args: {
				id: { name: 'id', type: GraphQLInt },
				title: { name: 'title', type: GraphQLString },
				slug: { name: 'slug', type: GraphQLString }
			},
			resolve: (root, args) => db('questions').find(args)
		}

	})
})

/**
 * Export `schema`
 */
module.exports = new GraphQLSchema({ query })
