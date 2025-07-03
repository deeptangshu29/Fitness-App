import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/users.js';
import sequelize from '../../config/database.js';
import User from '../../models/User.js';

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});

test('dummy test', () => {
	expect(true).toBe(true);
});


describe('User API', () => {
	it('should create a new user', async () => {
		const res = await request(app)
			.post('/users')
			.send({
				name: 'SuperTester',
				email: 'super@test.com',
				password: 'test1234'
			});

		expect(res.statusCode).toEqual(201);
		expect(res.body.name).toBe('SuperTester');
	});

	it('should fetch all users', async () => {
		const res = await request(app).get('/users');
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});