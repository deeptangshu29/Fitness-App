import request from 'supertest';
import express from 'express';
import logger from '../utils/logger.js';
import routes from '../routes/users.js';

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.status(200).send('Healthy!'));
app.use('/users', routes); // For later tests

test('dummy test', () => {
	expect(true).toBe(true);
});


describe('GET /health', () => {
	it('should return 200 OK', async () => {
		const response = await request(app).get('/health');
		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Healthy!');
	});
});