
const {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} = require('graphql')

const db = require('./db')
const UserType = require('./schema/user')

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

		users: {
			type: new GraphQLList(UserType),
			resolve: () => db('users').values()
		},

		/**
		 * Get user by `id` or by `name`
		 */
		user: {
			type: UserType,
			args: {
				id: { name: 'id', type: GraphQLInt },
				name: { name: 'name', type: GraphQLString }
			},
			resolve: (root, args) => db('users').find(args)
		}

	})
})

/**
 * Export `schema`
 */
module.exports = new GraphQLSchema({ query })
