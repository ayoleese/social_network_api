const { Schema, model } = require('mongoose');

// Schema to create user model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v){
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    },
);

userSchema.virtual('friendCount').get(function() {
    return this.friends.length
});

// userSchema.virtual('friendCount', {
//     ref: 'user',
//     localField: '_id',
//     foreignField: 'friends',
//     count: true
// });

const User = model('user', userSchema);

module.exports = User;