import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already in use' });
		}

		// Create new user (password will be hashed via hook)
		const user = await User.create({ name, email, password });

		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

// Login route
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: 'Invalid credentials' });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		// Generate token
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		);

		res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

export default router;
