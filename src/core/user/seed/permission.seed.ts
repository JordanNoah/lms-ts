import PermissionDto from "@/core/access/dto/permission.dto";
import AccessCoreService from "@/core/access/service";

export default async function seedDefaultUsers() {
    try {
        const permissions: PermissionDto[] = [
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
            new PermissionDto('View hidden user details', 'user:viewhiddendetails')
          ];
          

        for (const element of permissions) {
            const permission = await AccessCoreService.registerOrUpdatePermission(element);
        }
    } catch (error) {
        console.error('❌ Error al sembrar permisos por defecto:', error);
    }
}