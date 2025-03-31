import { sequelize } from '@/core/database/sequelize';

const Permission = sequelize.models.Permission;

export async function registerPermissions() {
  const permissions = ['user:view', 'user:edit'];

  for (const perm of permissions) {
    await Permission.findOrCreate({
      where: { name: perm },
      defaults: { id: `perm_${perm}` }
    });
  }
}
