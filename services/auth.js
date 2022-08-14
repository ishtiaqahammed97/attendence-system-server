const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByProperty, createNewUser } = require('./user');
const error = require('../utilities/error');

const registerService = async ({name, email, password}) => {
    let user = await findUserByProperty("email", email);
    if (user) {
        throw error('User already exist');
    }

    //hashing password by bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    createNewUser({ name, email, password: hash });
};

const loginService = async ({email, password}) => {
    const user = await findUserByProperty("email", email)

    if (!user) {
        // return res.status(400).json({ message: 'Invalid Credential' });
        throw error('Invalid Credential', 400);
    }

    // compare method provided by bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw error('Invalid Credential', 400);
    }
    // delete hashed password
    // delete user._doc.password;

    const payload = {
        _id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        accountStatus: user.accountStatus
    }

    return jwt.sign(payload, 'secret-key', { expiresIn: '2h' })
}

module.exports = {
    registerService,
    loginService
}