import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/core/database/sequelize';

import { PermissionModel } from './permission.model';
import { RolePermissionModel } from './rolePermission.model';

export interface RoleAttributes {
    id: number;
    name: string;
    shortName: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class RoleModel extends Model<RoleAttributes, Omit<RoleAttributes, 'id'>> implements RoleAttributes {
    declare id: number;
    declare name: string;
    declare shortName: string;
    declare description?: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    declare rolePermissions: RolePermissionModel[]

    public declare getPermissions: () => Promise<PermissionModel[]>;
    public declare setPermissions: (permissions: PermissionModel[]) => Promise<void>;
    public declare addPermission: (permission: PermissionModel) => Promise<void>;
    public declare addPermissions: (permissions: PermissionModel[]) => Promise<void>;
    public declare removePermission: (permission: PermissionModel) => Promise<void>;
}

RoleModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    shortName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {    
    tableName: 'roles',
    sequelize,
    underscored: true,
    timestamps: true
});
