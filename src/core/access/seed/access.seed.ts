import RoleDto from '../dto/role.dto';
import AccessCoreService from '../service';

export default async function seedDefaultRoles() {
  try {
    const roles: RoleDto[] = [
      new RoleDto(
        'Administrador',
        'admin',
        'Acceso total al sistema',
        [] // permisos se ignoran porque el admin tiene acceso total por middleware
      ),
      new RoleDto(
        'Visitante',
        'visitor',
        'Usuario visitante sin privilegios',
        [] // podrías agregar permisos básicos si deseas
      )
    ];

    for (const roleDto of roles) {
      const role = await AccessCoreService.registerOrUpdateRole(roleDto);
      console.log(`🎭 Rol "${role.shortName}" registrado con éxito`);
    }
  } catch (error) {
    console.error('❌ Error al sembrar roles por defecto:', error);
  }
}
