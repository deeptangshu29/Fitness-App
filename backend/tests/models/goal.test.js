import sequelize from '../../config/database.js';
import User from '../../models/User.js';
import Goal from '../../models/Goal.js';

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe('Goal Model', () => {
	it('should save user fitness goal', async () => {
		const user = await User.create({ name: 'U1', email: 'u1@mail.com', password: 'test123' });;
		const goal = await Goal.create({
			targetWeight: 70.5,
			targetDate: '2024-05-01',
			UserId: user.id
		});
		expect(goal.targetWeight).toBe(70.5);
	});
});
