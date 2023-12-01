const jwt = require('jsonwebtoken');

const User = require('../models/User');

class AuthMiddleware {
    static async isAuth(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            try {
                const token = await jwt.verify(bearerToken, process.env.TOKEN_SECRET);

                req.user = token;

                next();
            } catch (error) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    }

    static async isAdmin(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            try {
                const token = await jwt.verify(bearerToken, process.env.TOKEN_SECRET);

                const user = await User.findById(token._id);

                if (user.role === 'admin') {
                    req.user = token;
                
                    next();
                } else {
                    res.status(403).json({ success: false, message: 'Forbidden' });
                }
            } catch (error) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    }
}

module.exports = AuthMiddleware;