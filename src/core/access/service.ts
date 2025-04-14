import { sequelize } from '@/core/database/sequelize';
import { RoleModel } from './model/role.model';
import { PermissionModel } from './model/permission.model';
import RoleDto from './dto/role.dto';
import { RolePermissionModel } from './model/rolePermission.model';
import PermissionDto from './dto/permission.dto';
import { UserRoleModel } from '../user/model/user.role.model';
import PaginationDto from '@/shared/pagination.dto';
import RolePaginationEntity from './entities/role.pagination.entity';
import { Op } from 'sequelize';
import PermissionPaginationEntity from './entities/permission.pagination.entity';

export default class AccessCoreService {
  public async registerOrUpdateRole(roleDto:RoleDto): Promise<RoleModel> {
    try {
      const [role, created] = await RoleModel.findOrCreate({
        where: { shortName: roleDto.shortName },
        defaults: {
          name: roleDto.name,
          description: roleDto.description,
          shortName: roleDto.shortName,
        },
      });
  
      // 🔁 Si ya existía, actualizar sus datos base
      if (!created) {
        role.name = roleDto.name;
        role.description = roleDto.description;
        await role.save();
      }
  
      // 🧾 Si es el rol visitante sin permisos, asignar todos si aún no los tiene
      if (role.shortName === 'visitor' && roleDto.permissions.length === 0) {
        const existingPermissions = await this.getRolePermissions(role.id);
        if (existingPermissions.length === 0) {
          const allPermissions = await PermissionModel.findAll();
          await this.setRolePermissions(allPermissions, role);
        }
      }
  
      // 🎯 Si se especifican permisos explícitos, validar y asignar
      if (roleDto.permissions.length > 0) {
        const permissionIds = roleDto.permissions.map(p => p.id!);
        const permissions = await PermissionModel.findAll({ where: { id: permissionIds } });
  
        const foundIds = permissions.map(p => p.id);
        const missing = permissionIds.filter(id => !foundIds.includes(id));
  
        if (missing.length > 0) {
          throw new Error(`Missing permissions: ${missing.join(', ')}`);
        }
  
        await this.setRolePermissions(permissions, role);
      }
  
      return role;
    } catch (error) {
      throw new Error(`Error registering or updating role: ${error}`);
    }
  }
  
  public async setRolePermissions(permissions: PermissionModel[], role: RoleModel): Promise<void> {
    try {
      // 1. Eliminar todos los permisos actuales del rol
      await RolePermissionModel.destroy({
        where: { roleId: role.id }
      });
  
      // 2. Preparar nuevos permisos
      const records = permissions.map(p => ({
        roleId: role.id,
        permissionId: p.id
      }));
  
      // 3. Insertar en bloque
      if (records.length > 0) {
        await RolePermissionModel.bulkCreate(records);
      }
    } catch (error: any) {
      console.error(`❌ Error al asignar permisos al rol:`, error);
      throw new Error(`Error setting role permissions: ${error.message || error}`);
    }
  }  

  public async getRoleByShortName(shortName: string):Promise<RoleModel | null> {
    try {
      const role = await RoleModel.findOne({ where: { shortName }, });
      return role;
    } catch (error) {
      throw new Error(`Error getting role by name: ${error}`);
    }
  }

  public async getRoleById(id: number):Promise<RoleModel | null> {
    try {
      const role = await RoleModel.findByPk(id);
      if (!role) {
        throw new Error(`Role with id ${id} not found`);
      }
      
      if (role.shortName != "admin") {
        role.permissions = await this.getRolePermissions(id);
      }
      
      return role;
    } catch (error) {
      throw new Error(`Error getting role by id: ${error}`);
    }
  }

  public async registerOrUpdatePermission(permissionDto: PermissionDto): Promise<PermissionModel> {
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

  public async getRolePermissions(roleId: number): Promise<PermissionModel[]> {
    try {
      const rolePermissions = await RolePermissionModel.findAll({
        where: { roleId },
      });

      for (const rolePermission of rolePermissions) {
        const permission = await PermissionModel.findByPk(rolePermission.permissionId);
        if (permission) {
          rolePermission.permission = permission; // Assign the permission to the rolePermission object
        }
      }

      return rolePermissions.map(rolePermission => rolePermission.permission!); // ✅ without duplicates
    } catch (error) {
      throw new Error(`Error getting role permissions: ${error}`);
    }
  }
  
  public async getRolesByUser(id: number): Promise<RoleModel | null> {
    try {
      const roles = await RoleModel.findByPk(id);
      return roles;
    } catch (error) {
      throw new Error(`Error getting roles by user: ${error}`);
    }
  }

  public async setRoleToUser(userId: number, roleId: number): Promise<UserRoleModel> {
    try {
      const [user, created] = await UserRoleModel.findOrCreate({
        where: { userId, roleId },
        defaults: { userId, roleId },
      });

      if (created) {
        console.log(`Role ${roleId} assigned to user ${userId}`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error setting role to user: ${error}`);
    }
  }

  public async getRolePagination(pagination: PaginationDto): Promise<RolePaginationEntity> {
    try {
      const { itemsPerPage, page, sorting, search } = pagination;
      const offset = (page - 1) * itemsPerPage;
      const limit = itemsPerPage;
      const where: any = {};

      const roles = await RoleModel.findAndCountAll({
        where: {
          ...(search && {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
              { shortName: { [Op.like]: `%${search}%` } },
            ]
          }),
        },
        limit: limit,
        offset: offset,
        order: sorting ? [[sorting.key, sorting.order]] : undefined,
      })

      const total = roles.count;
      return new RolePaginationEntity(page, total, roles.rows);
    } catch (error) {
      throw new Error(`Error getting roles: ${error}`);
    }
  }

  public async getPaginatedPermissions(pagination: PaginationDto): Promise<PermissionPaginationEntity> {
    try {
      const { itemsPerPage, page, sorting, search } = pagination;
      const offset = (page - 1) * itemsPerPage;
      const limit = itemsPerPage;
      const where: any = {};

      const permissions = await PermissionModel.findAndCountAll({
        where: {
          ...(search && {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
              { abbreviation: { [Op.like]: `%${search}%` } },
            ]
          }),
        },
        limit: limit,
        offset: offset,
        order: sorting ? [[sorting.key, sorting.order]] : undefined,
        logging(sql, timing) {
          console.log('SQL:', sql);
          console.log('Timing:', timing);
        },
      })

      const total = permissions.count;
      return new PermissionPaginationEntity(page, total, permissions.rows);
    } catch (error) {
      console.log(error);
      
      throw new Error(`Error getting permissions: ${error}`);
    }
  }
}