const { check, validationResult } = require('express-validator');

exports.validateProfileUpdate = [
    check('email').optional().isEmail().withMessage('Invalid email format'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
