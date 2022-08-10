const express = require('express');
const connectDB = require('./db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

// middleware - that enable req.body
app.use(express.json());

app.post('/register', async (req, res, next) => {
	/**
	 * Request Input Sources:
	 * req Body
	 * req Param
	 * req Query
	 * req Header
	 * req Cookies
	 */
	// const name = req.body.name;
	// const email = req.body.email;
	// const password = req.body.password;

	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'Invalid Data' });
	}

	// check if the user is already registered
	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}

		user = new User({ name, email, password });

		//hashing password by bcrypt
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		// updating password to hash password
		user.password = hash;

		await user.save();

		return res.status(201).json({ message: 'User Created Successfully', user });
	} catch (error) {
		next(error);
	}
});
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

app.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: 'Invalid Credential' });
		}

		// compare method provided by bcrypt
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid Credential' });
		}
		// TODO: generate and return JWT

		// delete hashed password
		delete user._doc.password;
		return res.status(200).json({ message: 'Login Successful', user });
	} catch (e) {
		next(e);
	}
});

app.get('/', (_req, res) => {
	const obj = {
		name: 'Ayman',
		email: 'ayman@example.com',
	};
	res.json(obj);
});

// global error handler
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).json({ message: 'Server Error Occurred' });
});

// database connection
connectDB('mongodb://localhost:27017/attendance-db')
	.then(() => {
		console.log('Database Connected');
		// only if database connect successfully then we will run the application
		app.listen(4000, () => {
			console.log("I'm listening on port 4000");
		});
	})
	.catch((e) => console.log(e));