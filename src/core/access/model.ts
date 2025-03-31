import { Sequelize, DataTypes } from 'sequelize';

export const defineAccessModels = (sequelize: Sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'roles',
    underscored: true,
    freezeTableName: true
  });

  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'permissions',
    underscored: true,
    freezeTableName: true
  });

  const RolePermission = sequelize.define('RolePermission', {}, {
    tableName: 'role_permission',
    underscored: true,
    freezeTableName: true
  });

  Role.belongsToMany(Permission, { through: RolePermission });
  Permission.belongsToMany(Role, { through: RolePermission });

  return { Role, Permission, RolePermission };
};
