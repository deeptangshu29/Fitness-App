import sequelize from '../../config/database.js';
import User from '../../models/User.js';
import Meal from '../../models/Meal.js';

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe('Meal Model', () => {
	it('should create a meal for a user', async () => {
		const user = await User.create({ name: 'U1', email: 'u1@mail.com', password: 'test123' });
		const meal = await Meal.create({
			name: 'Breakfast',
			calories: 500,
			time: '2024-04-10T08:00:00',
			UserId: user.id
		});
		expect(meal.name).toBe('Breakfast');
	});
});
