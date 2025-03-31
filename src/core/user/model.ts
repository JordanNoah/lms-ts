import { Sequelize, DataTypes } from 'sequelize';

export default function defineUserModel (sequelize: Sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    role: DataTypes.STRING
  }, {
    tableName: 'users',
    underscored: true,
    freezeTableName: true
  });

  return {User}
};
