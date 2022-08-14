const {registerService, loginService} = require('../services/auth')

/**
     * Request Input Sources:
     * req Body
     * req Param
     * req Query
     * req Header
     * req Cookies
     */
const registerController = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Invalid Data' });
    }

    // check if the user is already registered
    try {
        const user = await registerService({name, email, password});

        return res.status(201).json({ message: 'User Created Successfully', user });
    } catch (error) {
        next(error);
    }
}


/**
 * Start
	email = input()
	password = input()
	user = find user with email
	if user not found: 
	return 400 error
	if password not equal to user.hash:
	return 400 error
	token = generate token using user
	return token
End
 */
const loginController = async (req, res, next) => {
	const { email, password } = req.body;
	try {
        const token = await loginService({email, password})
	
		return res.status(200).json({ message: 'Login Successful', token });
	} catch (e) {
		next(e);
	}
};

module.exports = {
    registerController,
    loginController
}