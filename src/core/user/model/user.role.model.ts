import { sequelize } from "@/core/database/sequelize"
import { DataTypes, Model } from "sequelize";

export interface UserRoleAttributes {
    id: number;
    userId: number;
    roleId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserRoleModel extends Model<UserRoleAttributes, Omit<UserRoleAttributes,'id'>> {
    declare id: number;
    declare userId: number;
    declare roleId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

UserRoleModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'user_roles',
    underscored: true,
    timestamps: true
});