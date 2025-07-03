import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trainer = sequelize.define('Trainer', {
	name: DataTypes.STRING,
	specialization: DataTypes.STRING,
});

export default Trainer;
