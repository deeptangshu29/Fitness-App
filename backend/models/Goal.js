import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Goal = sequelize.define('Goal', {
	targetWeight: DataTypes.FLOAT,
	targetDate: DataTypes.DATEONLY,
});

User.hasOne(Goal);
Goal.belongsTo(User);

export default Goal;
