import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../database/sequelize";

export interface CategoryCourseAttributes {
    id: number;
    name: string;
    description: string | null;
    idNumber: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CategoryCourseModel extends Model<CategoryCourseAttributes, Omit<CategoryCourseAttributes, 'id'>> implements CategoryCourseAttributes {
    declare id: number;
    declare name: string;
    declare description: string | null;
    declare idNumber: string | null;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

CategoryCourseModel.init({
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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    idNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
}, {
    tableName: 'category_courses',
    sequelize,
    underscored: true,
    timestamps: true
});