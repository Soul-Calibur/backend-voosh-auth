const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        photo: String,
        name: String,
        bio: String,
        phone: String,
        isPublic: { type: Boolean, default: true },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: String,
    facebookId: String,
    twitterId: String,
    githubId: String,
});

module.exports = mongoose.model('User', UserSchema);
