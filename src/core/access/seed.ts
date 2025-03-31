import { sequelize } from '@/core/database/sequelize';

export async function seedAccessControl() {
  console.log('🌱 Sembrando acceso...');

  const [adminRole] = await sequelize.models.Role.findOrCreate({
    where: { name: 'admin' },
    defaults: { id: 'role_admin' }
  });

  const allPermissions = await sequelize.models.Permission.findAll();

  for (const permission of allPermissions) {
    const has = await (adminRole as any).hasPermission(permission);
    if (!has) {
      await (adminRole as any).addPermission(permission);
    }
  }

  console.log(`✅ Admin tiene ${allPermissions.length} permisos.`);
}
