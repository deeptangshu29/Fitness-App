import express from 'express';
import Goal from '../models/Goal.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const goal = await Goal.create(req.body);
		res.status(201).json(goal);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/', async (req, res) => {
	const goals = await Goal.findAll();
	res.json(goals);
});

router.get('/:id', async (req, res) => {
	const goal = await Goal.findByPk(req.params.id);
	if (!goal) return res.status(404).json({ error: 'Not found' });
	res.json(goal);
});

router.put('/:id', async (req, res) => {
	const goal = await Goal.findByPk(req.params.id);
	if (!goal) return res.status(404).json({ error: 'Not found' });
	await goal.update(req.body);
	res.json(goal);
});

router.delete('/:id', async (req, res) => {
	const goal = await Goal.findByPk(req.params.id);
	if (!goal) return res.status(404).json({ error: 'Not found' });
	await goal.destroy();
	res.status(204).end();
});

export default router;
