import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/core/database/sequelize';

export interface UserAttributes {
  id: string;
  username: string;
  names: string;
  surnames: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel extends Model<UserAttributes, Omit<UserAttributes, 'id'>> implements UserAttributes {
  declare id: string;
  declare username: string;
  declare names: string;
  declare surnames: string;
  declare email: string;
  declare password: string;
  declare phone?: string;
  declare address?: string;
  declare city?: string;
  declare country?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserModel.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  names: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surnames: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  underscored: true,
  timestamps: true,
  paranoid: false
});
