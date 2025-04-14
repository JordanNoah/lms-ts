import PaginationDto from "@/shared/pagination.dto";
import { PluginAPI } from "../http/pluginApi";
import AccessCoreService from "./service";
import RoleDto from "./dto/role.dto";

const rolesRoutes: PluginAPI = {
    prefix: '/role',
    routes: [
        {
            method: 'POST',
            path: '/list',
            handler: async (c) => {
                try {
                    const { page, limit, sorting, search} = await c.req.json();
                    const paginationDto = new PaginationDto(limit, page, sorting, search)
                    const roles = await new AccessCoreService().getRolePagination(paginationDto);
                    return c.json(roles);
                } catch (error: any) {
                    return c.json({ error: error.message }, 500);
                }
            }
        },
        {
            method: 'GET',
            path: '/:id',
            handler: async (c) => {
                const id = c.req.param('id')
                try {
                    const role = await new AccessCoreService().getRoleById(Number(id))
                    if (!role) {
                        return c.json({ error: 'Role not found' }, 404)
                    }
                    
                    return c.json({role: role, permissions: role.permissions})
                } catch (error: any) {
                    return c.json({ error: error.message }, 500)
                }
            }
        },
        {
            method: 'POST',
            path: '/list/permissions',
            handler: async (c) => {
                try {
                    const { page, limit, sorting, search } = await c.req.json()
                    const paginationDto = new PaginationDto(limit, page, sorting, search)
                    const roles = await new AccessCoreService().getPaginatedPermissions(paginationDto)
                    
                    return c.json(roles)
                } catch (error: any) {
                    return c.json({ error: error.message }, 500)
                }
            }
        },
        {
            method: 'POST',
            path: '/',
            handler: async (c) => {
                try {
                    const [error, roleDto] = RoleDto.create(await c.req.json())
                    if (error) return c.json({ error }, 400)
                    
                    const role = await new AccessCoreService().registerOrUpdateRole(roleDto!)
                    return c.json(role)
                } catch (error: any) {
                    return c.json({ error: error.message }, 500)
                }
            }
        },
        {
            method: 'PUT',
            path: '/',
            handler: async (c) => {
                try {
                    const [error, roleDto] = RoleDto.create(await c.req.json())
                    
                    if (error) return c.json({ error }, 400)
                    const role = await new AccessCoreService().registerOrUpdateRole(roleDto!)
                    return c.json(role)
                } catch (error: any) {
                    return c.json({ error: error.message }, 500)
                }
            }
        }
    ]
}

export default rolesRoutes