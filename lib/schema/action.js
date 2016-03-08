
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const db = require('../db')
const UserType = require('./user')
const ArtifactType = require('./artifact')

/**
 * Export `Comment`
 */
module.exports = new GraphQLObjectType({
	name: 'Action',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			createdAt: {
				type: new GraphQLNonNull(GraphQLString),
				resolve: action => action.created_at
			},
			actor: {
				type: new GraphQLNonNull(UserType),
				resolve: action => {
					return db('users').find({ id: action.actor_id })
				}
			},
			type: {
				type: new GraphQLNonNull(GraphQLString)
			},
			actee: {
				type: UserType,
				resolve: action => {
					const user = db('users').find({ id: action.actee_id })
					return user
				}
			},
			author: {
				type: UserType,
				resolve: action => {
					const user = db('users').find({ id: action.author_id })
					return user
				}
			},
			artifact: {
				type: ArtifactType,
				resolve: action => {
					if (!action.artifact_id) return
					// HACK: I'm sorry :(
					const artifacts = db._(db('questions').value())
						.map('artifacts')
						.flatten()
						.compact()
					const artifact = artifacts.find({ id: action.artifact_id })
					return artifact
				}
			},
			count: {
				type: GraphQLInt
			}
		}
	}
})
