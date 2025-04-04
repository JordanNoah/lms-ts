import { sequelize } from '@/core/database/sequelize';
import { RoleModel } from './model/role.model';
import { PermissionModel } from './model/permission.model';
import RoleDto from './dto/role.dto';
import { RolePermissionModel } from './model/rolePermission.model';
import PermissionDto from './dto/permission.dto';

export default class AccessCoreService {
  static async registerOrUpdateRole(roleDto:RoleDto): Promise<RoleModel> {
    try {
      let [role, created] = await RoleModel.findOrCreate({
        where: { shortName: roleDto.shortName },
        defaults: {
          name: roleDto.name,
          description: roleDto.description,
          shortName: roleDto.shortName,
        },  
      });
      
      if (role!.shortName === "visitor") {
        const actualRoles = await this.getRolePermissions(role.id)
        if (actualRoles.length == 0) {
          const permissions = await PermissionModel.findAll();
          await this.setRolePermissions(permissions, role!);
        }
      }

      if (roleDto.permissions.length > 0) {
        const permissionsIds = roleDto.permissions.map((permission) => permission.id!);
        const permissions = await PermissionModel.findAll({
          where: {
            id: permissionsIds,
          }
        })

        const foundIds = permissions.map((perm) => perm.id);
        const missing = permissionsIds.filter((id) => !foundIds.includes(id));

        if (missing.length > 0) {
          throw new Error(`Missing permissions: ${missing.join(', ')}`);
        }

        await role!.setPermissions(permissions);
      }
      return role!;
    }  catch (error) {
      throw new Error(`Error registering roles: ${error}`);
    }
  }
  
  static async getRolePermissions(roleId: number): Promise<PermissionModel[]> {
    const rows = await RolePermissionModel.findAll({ where: { roleId: roleId } });
    const perms = await PermissionModel.findAll({
      where: { id: rows.map(r => r.permissionId) }
    });
    return perms;
  }

  static async setRolePermissions(permissionModel:PermissionModel[], role: RoleModel): Promise<void> {
    await RolePermissionModel.bulkCreate(
      permissionModel.map(p => ({ roleId: role.id, permissionId: p.id }))
    );
  }

  static async getRoleByShortName(shortName: string):Promise<RoleModel | null> {
    try {
      const role = await RoleModel.findOne({ where: { shortName }, });
      return role;
    } catch (error) {
      throw new Error(`Error getting role by name: ${error}`);
    }
  }

  static async getRoleById(id: number):Promise<RoleModel | null> {
    try {
      const role = await RoleModel.findByPk(id);
      return role;
    } catch (error) {
      throw new Error(`Error getting role by id: ${error}`);
    }
  }

  static async registerOrUpdatePermission(permissionDto: PermissionDto): Promise<PermissionModel> {
    try {
      let [permission, created] = await PermissionModel.findOrCreate({
        where: { abbreviation: permissionDto.shortName },
        defaults: {
          name: permissionDto.name,
          description: permissionDto.description,
          abbreviation: permissionDto.shortName,
        },
      });

      if (created) {
        console.log(`🪪 Permission ${permissionDto.name} created`);
      }
      return permission;
    } catch (error) {
      throw new Error(`Error registering permissions: ${error}`);
    }
  }
}