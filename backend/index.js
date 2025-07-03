// File: index.js
// Description: This file initializes the Express server, connects to the database, and sets up the API routes.

import express from 'express';
import sequelize from './config/database.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import Meal from './models/Meal.js';
import Trainer from './models/Trainer.js';
import Goal from './models/Goal.js';
import './models/UserTrainer.js';
import logger from './utils/logger.js'; // ✅ Import logger
import cors from 'cors';

// Import routes
import userRoutes from './routes/users.js';
import workoutRoutes from './routes/workouts.js';
import mealRoutes from './routes/meals.js';
import trainerRoutes from './routes/trainers.js';
import goalRoutes from './routes/goals.js';
import authRoutes from './routes/auth.js';

// Import GraphQL
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
import schema from './graphql/schema.js';

const app = express();
app.use(express.json());

app.use(cors({
	origin: [
		'http://localhost:5173',
		'http://localhost:5174'
	],
	credentials: true,
}));


const startServer = async () => {
	try {
		await sequelize.authenticate();
		logger.info('✅ Connected to MySQL');

		await sequelize.sync({ force: false, alter: false }); // Dev only
		logger.info('✅ Tables synced');

		app.listen(3000, () => {
			logger.info('🚀 Server running at http://localhost:3000');
		});
	} catch (err) {
		logger.error(`❌ Error starting server: ${err.message}`);
	}
};

console.log(`[ENV CHECK] NODE_ENV = ${process.env.NODE_ENV}`);
console.log('→ Connecting to DB:', process.env.DB_NAME, '@', process.env.DB_HOST);

// Server routes
app.get('/', (req, res) => {
	logger.info('GET / called');
	res.send('FitFusion API is running!');
});
app.get('/health', (req, res) => {
	logger.info('GET /health called');
	res.send('Healthy!');
});

// Model Routes
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/meals', mealRoutes);
app.use('/trainers', trainerRoutes);
app.use('/goals', goalRoutes);
app.use('/auth', authRoutes);

// GraphQL endpoint
app.use('/graphql', createHandler({ schema }));

// GraphiQL Playground
app.get('/graphiql', (_req, res) => {
	logger.info('GET /graphiql called');
	res.type('html').send(ruruHTML({ endpoint: '/graphql' }));
});

startServer();