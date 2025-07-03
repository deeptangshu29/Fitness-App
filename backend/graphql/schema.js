import {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLInt,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID,
} from 'graphql';

import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Meal from '../models/Meal.js';
import Goal from '../models/Goal.js';
import Trainer from '../models/Trainer.js';
import { fetchWeatherByCity } from '../utils/weather.js'; // <-- Added
import logger from '../utils/logger.js'; // ✅ Add this line


// --- New: WeatherType ---
const WeatherType = new GraphQLObjectType({
	name: 'Weather',
	fields: () => ({
		city: { type: GraphQLString },
		temperature: { type: GraphQLFloat },
		description: { type: GraphQLString },
		humidity: { type: GraphQLInt },
		windSpeed: { type: GraphQLFloat },
	}),
});

// --- Existing Types ---
const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		workouts: {
			type: new GraphQLList(WorkoutType),
			resolve: (user) => Workout.findAll({ where: { UserId: user.id } }),
		},
		meals: {
			type: new GraphQLList(MealType),
			resolve: (user) => Meal.findAll({ where: { UserId: user.id } }),
		},
		goal: {
			type: GoalType,
			resolve: (user) => Goal.findOne({ where: { UserId: user.id } }),
		},
	}),
});

const WorkoutType = new GraphQLObjectType({
	name: 'Workout',
	fields: () => ({
		id: { type: GraphQLID },
		type: { type: GraphQLString },
		duration: { type: GraphQLInt },
		date: { type: GraphQLString },
		user: {
			type: UserType,
			resolve: (workout) => User.findByPk(workout.UserId),
		},
	}),
});

const MealType = new GraphQLObjectType({
	name: 'Meal',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		calories: { type: GraphQLInt },
		time: { type: GraphQLString },
		user: {
			type: UserType,
			resolve: (meal) => User.findByPk(meal.UserId),
		},
	}),
});

const GoalType = new GraphQLObjectType({
	name: 'Goal',
	fields: () => ({
		id: { type: GraphQLID },
		targetWeight: { type: GraphQLFloat },
		targetDate: { type: GraphQLString },
		user: {
			type: UserType,
			resolve: (goal) => User.findByPk(goal.UserId),
		},
	}),
});

const TrainerType = new GraphQLObjectType({
	name: 'Trainer',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		specialization: { type: GraphQLString },
	}),
});

// --- Root Query ---
const RootQuery = new GraphQLObjectType({
	name: 'Query',
	fields: {
		users: { type: new GraphQLList(UserType), resolve: () => User.findAll() },
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve: (_, args) => User.findByPk(args.id),
		},
		workouts: { type: new GraphQLList(WorkoutType), resolve: () => Workout.findAll() },
		workout: {
			type: WorkoutType,
			args: { id: { type: GraphQLID } },
			resolve: (_, args) => Workout.findByPk(args.id),
		},
		meals: { type: new GraphQLList(MealType), resolve: () => Meal.findAll() },
		meal: {
			type: MealType,
			args: { id: { type: GraphQLID } },
			resolve: (_, args) => Meal.findByPk(args.id),
		},
		goals: { type: new GraphQLList(GoalType), resolve: () => Goal.findAll() },
		goal: {
			type: GoalType,
			args: { id: { type: GraphQLID } },
			resolve: (_, args) => Goal.findByPk(args.id),
		},
		trainers: { type: new GraphQLList(TrainerType), resolve: () => Trainer.findAll() },
		trainer: {
			type: TrainerType,
			args: { id: { type: GraphQLID } },
			resolve: (_, args) => Trainer.findByPk(args.id),
		},

		// --- New: Weather Query ---
		weather: {
			type: WeatherType,
			args: {
				city: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (_, { city }) => {
				try {
					logger.info(`Fetching weather for city: ${city}`);
					const data = await fetchWeatherByCity(city);
					logger.info(`Weather data received for ${city}`);
					return {
						city: data.name,
						temperature: data.main.temp,
						description: data.weather[0].description,
						humidity: data.main.humidity,
						windSpeed: data.wind.speed,
					};
				} catch (err) {
					logger.error(`Error fetching weather for ${city}: ${err.message}`);
					throw new Error('Weather data unavailable');
				}
			},
		},
	},
});

// --- Schema Export ---
const schema = new GraphQLSchema({
	query: RootQuery,
});

export default schema;
