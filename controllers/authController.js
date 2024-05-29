const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({
            username,
            email,
            password
        });
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY_TIME },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: info ? info.message : 'Login failed', user });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const payload = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
            return res.json({ token });
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully' });
};

exports.oauthCallback = (req, res) => {
    const payload = {
        user: {
            id: req.user.id
        }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
    res.json({ token });
};
