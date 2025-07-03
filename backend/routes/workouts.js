import express from 'express';
import Workout from '../models/Workout.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const workout = await Workout.create(req.body);
		res.status(201).json(workout);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/', async (req, res) => {
	const workouts = await Workout.findAll();
	res.json(workouts);
});

router.get('/:id', async (req, res) => {
	const workout = await Workout.findByPk(req.params.id);
	if (!workout) return res.status(404).json({ error: 'Not found' });
	res.json(workout);
});

router.put('/:id', async (req, res) => {
	const workout = await Workout.findByPk(req.params.id);
	if (!workout) return res.status(404).json({ error: 'Not found' });
	await workout.update(req.body);
	res.json(workout);
});

router.delete('/:id', async (req, res) => {
	const workout = await Workout.findByPk(req.params.id);
	if (!workout) return res.status(404).json({ error: 'Not found' });
	await workout.destroy();
	res.status(204).end();
});

export default router;
