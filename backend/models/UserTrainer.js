import sequelize from '../config/database.js';
import User from './User.js';
import Trainer from './Trainer.js';

const UserTrainer = sequelize.define('UserTrainer', {}, { timestamps: false });

User.belongsToMany(Trainer, { through: UserTrainer });
Trainer.belongsToMany(User, { through: UserTrainer });

export default UserTrainer;