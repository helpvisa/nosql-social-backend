// dependencies
const { Schema, model, Types } = require('mongoose');
const formatDate = require('../utils/formatDate');

// validators
function validateLength(length) {
    return (length < 280 && length > 0);
}

// schemas
const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            validate: [validateLength, 'Please make sure your reaction is between 1 and 280 characters.'],
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => formatDate(createdAtVal),
        }
    },
    {
        toJson: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            validate: [validateLength, 'Please make sure your thought is between 1 and 280 characters.'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => formatDate(createdAtVal),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ReactionSchema]
    },
    {
        toJson: {
            virtuals: true,
            getters: true
        }
    }
);

// virtuals
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// create model
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;