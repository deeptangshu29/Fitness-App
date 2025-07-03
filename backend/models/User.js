import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
	name: DataTypes.STRING,
	email: { type: DataTypes.STRING, unique: true },
	password: DataTypes.STRING,
});
// Hook to hash password before saving
User.beforeCreate(async (user) => {
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
});
export default User;
