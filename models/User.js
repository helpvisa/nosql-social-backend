// dependencies
const { Schema, model} = require('mongoose');

// validators
function validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}

// schemas
const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: validateEmail,
                message: 'Please provide a valid email address.'
            },
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

// virtuals
// get number of friends
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// get number of thoughts
UserSchema.virtual('thoughtCount').get(function() {
    return this.thoughts.length;
});

// create model
const User = model('User', UserSchema);

module.exports = User;