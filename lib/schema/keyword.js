
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString
} = require('graphql')

const db = require('../db')

/**
 * Export `Comment`
 */
module.exports = new GraphQLObjectType({
	name: 'Keyword',
	fields () {
		return {
			id: { type: new GraphQLNonNull(GraphQLInt) },
			title: { type: new GraphQLNonNull(GraphQLString) },
			slug: { type: new GraphQLNonNull(GraphQLString) }
		}
	}
})
