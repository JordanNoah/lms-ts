import PermissionDto from "@/core/access/dto/permission.dto";
import AccessCoreService from "@/core/access/service";

export default async function seedDefaultPermission() {
    try {
        const permissions: PermissionDto[] = [
            // 📚 Pages
            new PermissionDto('Site administration', 'page:managesiteadmins'),
            // 👤 Usuarios
            new PermissionDto('Change own password', 'user:changeownpassword'),
            new PermissionDto('Create users', 'user:create'),
            new PermissionDto('Delete users', 'user:delete'),
            new PermissionDto('Edit own messaging profile', 'user:editownmessageprofile'),
            new PermissionDto('Edit own profile', 'user:editownprofile'),
            new PermissionDto('Update user profiles', 'user:update'),
            new PermissionDto('Edit messaging profile', 'user:editmessageprofile'),
            new PermissionDto('Edit user profile', 'user:editprofile'),
            new PermissionDto('View all user blogs', 'user:readuserblogs'),
            new PermissionDto('View all forum posts', 'user:readuserposts'),
            new PermissionDto('View full user info', 'user:viewalldetails'),
            new PermissionDto('View last IP address', 'user:viewlastip'),
            new PermissionDto('Login as other user', 'user:loginas'),
            new PermissionDto('View user profiles', 'user:viewdetails'),
            new PermissionDto('View hidden user details', 'user:viewhiddendetails'),
          
            // 🔐 Gestión de permisos y roles (basado en el último bloque visual)
            new PermissionDto('View user policies', 'permissions:viewuserpolicies'),
            new PermissionDto('Manage site administrators', 'permissions:managesiteadmins'),
            new PermissionDto('Define roles', 'permissions:manageroles'),
            new PermissionDto('Assign system roles', 'permissions:assignsystemroles'),
            new PermissionDto('Check system permissions', 'permissions:checksystempermissions'),
            new PermissionDto('View capability overview', 'permissions:viewcapabilities'),
            new PermissionDto('Assign roles to cohorts', 'permissions:assigncohortroles'),
            new PermissionDto('View unsupported role assignments', 'permissions:viewunsupportedroles')
          ]          
          

        for (const element of permissions) {            
            const permission = await new AccessCoreService().registerOrUpdatePermission(element);
        }
    } catch (error) {
        console.error('❌ Error al sembrar permisos por defecto:', error);
    }
}