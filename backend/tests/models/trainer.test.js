import sequelize from '../../config/database.js';
import Trainer from '../../models/Trainer.js';

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe('Trainer Model', () => {
	it('should create a trainer', async () => {
		const trainer = await Trainer.create({ name: 'Fit Joe', specialization: 'Strength' });
		expect(trainer.specialization).toBe('Strength');
	});
});
