import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/core/database/sequelize';

export interface PermissionAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PermissionModel extends Model<PermissionAttributes, Omit<PermissionAttributes, 'id'>> implements PermissionAttributes {
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PermissionModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'permissions',
  sequelize,
  underscored: true,
  timestamps: true
});
