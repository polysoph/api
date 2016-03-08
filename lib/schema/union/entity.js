
const {
	GraphQLInt,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
	GraphQLEnumType,
	GraphQLUnionType
} = require('graphql')

const db = require('../../db')
const CommentType = require('../comment')
const ActionType = require('../action')
const ArtifactType = require('../artifact')

const _ = db._

module.exports = new GraphQLUnionType({
	name: 'DiscussionEntity',
	types: [CommentType, ActionType, ArtifactType],
	resolveType (obj) {
		if (obj.actor_id) return ActionType
		if (obj.source) return ArtifactType
		if (obj.contents) return CommentType
	}
})
