import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Workout = sequelize.define('Workout', {
	type: DataTypes.STRING,
	duration: DataTypes.INTEGER,
	date: DataTypes.DATEONLY,
});

User.hasMany(Workout);
Workout.belongsTo(User);

export default Workout;
