const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const tanishGPTAuth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // Check token exists
        if (!authHeader) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id)
            .select('-password');

        // Check user exists
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

module.exports = tanishGPTAuth;