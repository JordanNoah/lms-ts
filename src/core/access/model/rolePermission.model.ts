import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/core/database/sequelize";
import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";

interface RolePermissionAttributes {
    id: number;
    roleId: number;
    permissionId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class RolePermissionModel extends Model<RolePermissionAttributes, Omit<RolePermissionAttributes, 'id'>> {
    declare id: number
    declare roleId: number
    declare permissionId: number
    declare readonly createdAt: Date
    declare readonly updatedAt: Date
    declare permission:PermissionModel
}

RolePermissionModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: RoleModel,          // 👈 el nombre de la tabla referenciada
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PermissionModel,    // 👈 el nombre de la tabla referenciada
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'role_permission',
    sequelize,
    underscored: true,
    timestamps: true
  });
  
  RoleModel.belongsToMany(PermissionModel, {
    through: RolePermissionModel,
    foreignKey: 'roleId',
    otherKey: 'permissionId'
  });
  
  PermissionModel.belongsToMany(RoleModel, {
    through: RolePermissionModel,
    foreignKey: 'permissionId',
    otherKey: 'roleId'
  });
