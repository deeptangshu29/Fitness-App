// utils/logger.js
import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(
			({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
		)
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join('logs', 'app.log'),
			level: 'info',
		}),
		new winston.transports.File({
			filename: path.join('logs', 'error.log'),
			level: 'error',
		}),
	],
});

export default logger;
