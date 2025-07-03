import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(201).json(user);
	} catch (e) {
		res.status(400).json({ error: e.message });
	}
});

router.get('/', async (req, res) => {
	const users = await User.findAll();
	res.json(users);
});

router.get('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json(user);
});

router.put('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	await user.update(req.body);
	res.json(user);
});

router.delete('/:id', async (req, res) => {
	const user = await User.findByPk(req.params.id);
	if (!user) return res.status(404).json({ error: 'User not found' });
	await user.destroy();
	res.status(204).end();
});

export default router;
