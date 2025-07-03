import express from 'express';
import Trainer from '../models/Trainer.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const trainer = await Trainer.create(req.body);
		res.status(201).json(trainer);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/', async (req, res) => {
	const trainers = await Trainer.findAll();
	res.json(trainers);
});

router.get('/:id', async (req, res) => {
	const trainer = await Trainer.findByPk(req.params.id);
	if (!trainer) return res.status(404).json({ error: 'Not found' });
	res.json(trainer);
});

router.put('/:id', async (req, res) => {
	const trainer = await Trainer.findByPk(req.params.id);
	if (!trainer) return res.status(404).json({ error: 'Not found' });
	await trainer.update(req.body);
	res.json(trainer);
});

router.delete('/:id', async (req, res) => {
	const trainer = await Trainer.findByPk(req.params.id);
	if (!trainer) return res.status(404).json({ error: 'Not found' });
	await trainer.destroy();
	res.status(204).end();
});

export default router;
