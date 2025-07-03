import sequelize from '../../config/database.js';
import User from '../../models/User.js';
import Workout from '../../models/Workout.js';

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe('Workout Model', () => {
	it('should create a workout linked to a user', async () => {
		const user = await User.create({ name: 'U1', email: 'u1@mail.com', password: 'test123' });;
		const workout = await Workout.create({
			type: 'Cardio',
			duration: 30,
			date: '2024-04-10',
			UserId: user.id
		});
		expect(workout.type).toBe('Cardio');
		expect(workout.UserId).toBe(user.id);
	});
});
