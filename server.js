const express = require('express');
const connectDB = require('./db');
const authenticate = require('./middleware/authenticate')
const routes = require('./routes/index')

const app = express();
// middleware - that enable req.body
app.use(express.json());
app.use(routes);



// securing a route by jwt 
app.get('/private', authenticate, async (req, res) => {
	// console.log('I am user', req.user)
	return res.status(201).json({ message: 'This is private route' })
})

app.get('/public', (req, res) => {
	return res.status(201).json({ message: 'This is public route' })
})

app.get('/', (_req, res) => {
	const obj = {
		name: 'Ayman',
		email: 'ayman@example.com',
	};
	res.json(obj);
});


// global error handler
app.use((err, req, res, next) => {
	// console.log(err);
	const status = err.status ? err.status : 500
	const message = err.message ? err.message : 'Server Error Occurred'
	res.status(status).json({ message });
});

// database connection
connectDB('mongodb://localhost:27017/attendance-db', { serverSelectionTimeoutMS: 1000 })
	.then(() => {
		console.log('Database Connected');
		// only if database connect successfully then we will run the application
		app.listen(4000, () => {
			console.log("I'm listening on port 4000");
		});
	})
	.catch((e) => console.log(e))