import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/core/database/sequelize";

export interface CourseAttributes {
    id: number;
    shortName: string;
    name: string;
    description?: string;
    idNumber?: string | null;
    sectionId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CourseModel extends Model<CourseAttributes, Omit<CourseAttributes, 'id'>> implements CourseAttributes {
    declare id: number;
    declare shortName: string;
    declare name: string;
    declare description?: string;
    declare idNumber?: string | null;
    declare sectionId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

CourseModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    shortName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    tableName: 'courses',
    sequelize,
    underscored: true,
    timestamps: true
});