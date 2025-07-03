import express from 'express';
import Meal from '../models/Meal.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const meal = await Meal.create(req.body);
		res.status(201).json(meal);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/', async (req, res) => {
	const meals = await Meal.findAll();
	res.json(meals);
});

router.get('/:id', async (req, res) => {
	const meal = await Meal.findByPk(req.params.id);
	if (!meal) return res.status(404).json({ error: 'Not found' });
	res.json(meal);
});

router.put('/:id', async (req, res) => {
	const meal = await Meal.findByPk(req.params.id);
	if (!meal) return res.status(404).json({ error: 'Not found' });
	await meal.update(req.body);
	res.json(meal);
});

router.delete('/:id', async (req, res) => {
	const meal = await Meal.findByPk(req.params.id);
	if (!meal) return res.status(404).json({ error: 'Not found' });
	await meal.destroy();
	res.status(204).end();
});

export default router;
