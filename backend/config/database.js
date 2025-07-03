import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);  // Helpful for debugging

// Ensure NODE_ENV defaults to 'development' if not set
const env = process.env.NODE_ENV?.trim() || 'development';
const isTest = env === 'test';

// Only use SQLite for testing, and MySQL for development and production
const sequelize = isTest
	? new Sequelize({
		dialect: 'sqlite',
		storage: ':memory:',  // In-memory SQLite database for tests
		logging: true,       // Optional: disable logging
	})
	: new Sequelize(
		process.env.DB_NAME,  // Use your MySQL database name
		process.env.DB_USER,  // Use your MySQL user
		process.env.DB_PASSWORD,  // Use your MySQL password
		{
			host: process.env.DB_HOST, // Use your MySQL host
			dialect: 'mysql',   // Use MySQL for dev/production
			logging: false,     // Optional: disable logging
		}
	);

export default sequelize;











































// // File: config/database.js
// // Description: This file sets up the database connection using Sequelize ORM.

// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const isTest = process.env.NODE_ENV === 'test';

// const sequelize = new Sequelize(
// 		process.env.DB_NAME,
// 		process.env.DB_USER,
// 		process.env.DB_PASSWORD,
// 		{
// 			host: process.env.DB_HOST,
// 			dialect: 'mysql',
// 			logging: false,  // optional: disables SQL output in terminal
// 		}
// 	);

// export default sequelize;
