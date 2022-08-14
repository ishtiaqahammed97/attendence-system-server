const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
    // getting token from user
    let token = req.headers.authorization;

    // check if the token is present, if not send error
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        // remove the 'bearer' from token 
        token = token.split(' ')[1]
        // verifying token
        const decoded = jwt.verify(token, 'secret-key');

        // check if the id is present in database, if not send error
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // controller must know who is the user
        req.user = user;
        next();

    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: 'Invalid token' })
    }
}

module.exports = authenticate;