const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.viewOwnProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.editProfile = async (req, res, next) => {
    const { photo, name, bio, phone, email, password, isPublic } = req.body;
    const profileFields = { photo, name, bio, phone, isPublic };
    if (email) profileFields.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        profileFields.password = await bcrypt.hash(password, salt);
    }

    try {
        let user = await User.findById(req.user.id);
        if (user) {
            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: profileFields },
                { new: true }
            ).select('-password');
            return res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
};

exports.listPublicProfiles = async (req, res, next) => {
    try {
        const users = await User.find({ 'profile.isPublic': true }).select('profile');
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.viewProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('profile');
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.profile.isPublic && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(user.profile);
    } catch (err) {
        next(err);
    }
};

exports.listAllProfiles = async (req, res, next) => {
    try {
        const users = await User.find().select('profile');
        res.json(users);
    } catch (err) {
        next(err);
    }
};
