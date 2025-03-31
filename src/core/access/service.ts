import { sequelize } from '@/core/database/sequelize';

const Role = sequelize.models['core.Role'];
const Permission = sequelize.models['core.Permission'];

// Interface local para incluir getPermissions()
interface RoleInstance {
  getPermissions: () => Promise<{ name: string }[]>;
  addPermission: (perm: any) => Promise<void>;
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export async function roleHasPermission(roleName: string, permissionName: string): Promise<boolean> {
  const role = await Role.findOne({
    where: { name: roleName }
  }) as unknown as RoleInstance;

  if (!role) return false;

  const permissions = await role.getPermissions();
  return permissions.some((p) => p.name === permissionName);
}

/**
 * Verifica si un rol tiene al menos uno de varios permisos
 */
export async function roleHasAnyPermission(roleName: string, permissions: string[]): Promise<boolean> {
  const role = await Role.findOne({
    where: { name: roleName }
  }) as unknown as RoleInstance;

  if (!role) return false;

  const rolePermissions = await role.getPermissions();
  return rolePermissions.some((p) => permissions.includes(p.name));
}

/**
 * Asigna un permiso a un rol
 */
export async function assignPermissionToRole(roleName: string, permissionName: string) {
  const [role] = await Role.findOrCreate({
    where: { name: roleName },
    defaults: { id: `role_${roleName}` }
  });

  const [permission] = await Permission.findOrCreate({
    where: { name: permissionName },
    defaults: { id: `perm_${permissionName}` }
  });

  await (role as unknown as RoleInstance).addPermission(permission);
}

/**
 * Obtiene todos los permisos de un rol
 */
export async function getPermissionsForRole(roleName: string): Promise<string[]> {
  const role = await Role.findOne({
    where: { name: roleName }
  }) as unknown as RoleInstance;

  if (!role) return [];

  const permissions = await role.getPermissions();
  return permissions.map((p) => p.name);
}
