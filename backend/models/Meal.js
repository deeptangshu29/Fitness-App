import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Meal = sequelize.define('Meal', {
	name: DataTypes.STRING,
	calories: DataTypes.INTEGER,
	time: DataTypes.STRING,
});

User.hasMany(Meal);
Meal.belongsTo(User);

export default Meal;
