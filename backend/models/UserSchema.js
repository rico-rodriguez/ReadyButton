const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {type: String, required: true, unique: true},
    clicks: {type: Number, default: 0}
});

// const User = mongoose.model('User', userSchema);

const UserSchema = mongoose.model('UserSchema', userSchema, 'users');
module.exports = UserSchema;