
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const db = require('../db')
const UserType = require('./user')
const SourceType = require('./source')

/**
 * Export `Comment`
 */
module.exports = new GraphQLObjectType({
	name: 'Artifact',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			createdAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: artifact => artifact.created_at
			},
			title: {
				type: GraphQLString
			},
			type: {
				type: GraphQLString
			},
			reference: {
				type: GraphQLString
			},
			owner: {
				type: new GraphQLNonNull(UserType),
				resolve: artifact => {
					return db('users').find({ id: artifact.owner_id })
				}
			},
			source: {
				type: SourceType
			},
			lastUpdatedAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: artifact => artifact.last_updated_at
			}
		}
	}
})
