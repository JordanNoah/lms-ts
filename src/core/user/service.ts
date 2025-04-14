import { Op } from "sequelize";
import UserDto from "./dto/user.dto";
import { UserModel } from "./model/user.model";
import AccessCoreService from "../access/service";
import { UserRoleModel } from "./model/user.role.model";
import { RoleModel } from "../access/model/role.model";
import { PermissionModel } from "../access/model/permission.model";
import PaginationDto from "@/shared/pagination.dto";
import UserPaginationEntity from "./entities/user.pagination.entity";

export default class UserService {
    public async createUser(userDto: UserDto): Promise<UserModel> {
        try {
            let role = null
            if(userDto.role) {
                role = await new AccessCoreService().getRoleById(userDto.role)
            }else{
                role = await new AccessCoreService().getRoleByShortName("visitor")
            }
            if (!role) {
                throw new Error("Role not found");
            }
            
            const user = await UserModel.create(userDto);
            const userRole = await new AccessCoreService().setRoleToUser(user.id, role.id);

            return user;
        }catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    public async createAdmin(): Promise<UserModel> {
        try {
            const existAdmin = await this.getUsersByRole(1);
            if (existAdmin.length > 0) {
                return existAdmin[0]; // Si ya existe un admin, lo retornamos
            }
            const adminRole = await new AccessCoreService().getRoleById(1)
            if (!adminRole) {
                throw new Error("Admin role not found");
            }

            const [user, created] = await UserModel.findOrCreate({
                where: { username: "admin" },
                defaults: {
                    names: "admin",
                    email: "changme@gmail.com",
                    password: "changeme",
                    surnames: "changeme",
                    username: "admin",
                }
            })

            await this.setRoleToUser(user.id,adminRole.id)

            return user;
        } catch (error) {
            console.log(error);
            
            throw new Error(`Error creating admin: ${error}`);
        }
    }

    public async setRoleToUser(userId: number, roleId: number): Promise<UserRoleModel> {
        try {
            const [user,created] = await UserRoleModel.findOrCreate({
                where: { userId, roleId },
                defaults: { userId, roleId },
            })

            if (created) {
                console.log(`Role ${roleId} assigned to user ${userId}`);
            }
            return user;
        } catch (error) {
            throw new Error(`Error setting role to user: ${error}`);
        }
    }

    public async getUsersByRole(roleId: number): Promise<UserModel[]> {
        try {
            const role = await this.getRoleById(roleId);
            if (!role) {
                throw new Error(`Role with ID ${roleId} not found`);
            }

            const userRole = await UserRoleModel.findAll({
                where: { roleId: role.id },
            })

            const userIds = userRole.map((userRole) => userRole.userId);
            const users = await UserModel.findAll({
                where: { id: userIds },
            });
            return users;
        } catch (error) {
            throw new Error(`Error fetching users by role: ${error}`);
        }
    }

    public async existsUser(username: string, email: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({
                where: {
                  [Op.or]: [
                    { username: username.toLowerCase() },
                    { email: email.toLowerCase() } // si `username` puede ser email también
                  ]
                }
              });
              
            return !!user; // Devuelve true si el usuario existe, false si no
        } catch (error) {
            throw new Error(`Error checking user existence: ${error}`);
        }
    }

    public async getRoleById(roleId: number): Promise<RoleModel | null> {
        try {
            const role = await RoleModel.findByPk(roleId);
            return role;
        } catch (error) {
            throw new Error(`Error fetching role by ID: ${error}`);
        }
    }

    public async getRoleByShortName(shortName: string): Promise<RoleModel | null> {
        try {
            const role = await RoleModel.findOne({
                where: { shortName: shortName },
            });
            return role;
        } catch (error) {
            throw new Error(`Error fetching role by short name: ${error}`);
        }
    }

    public async getByUsername(username: string): Promise<UserModel | null> {
        try {
            const user = await UserModel.findOne({
                where: { username: username },
            });

            if (!user) {
                return null; // O lanzar un error, según tu preferencia
            }

            user.roles = await this.getUsersRoles(user.id); // Asignar roles al usuario            
            
            return user;
        } catch (error) {
            throw new Error(`Error fetching user by username: ${error}`);
        }
    }

    public async getUsersRoles(userId: number): Promise<RoleModel[]> {
        try {
            const userRoles = await UserRoleModel.findAll({
                where: { userId: userId },
            });
            
            if (!userRoles) {
                return []; // O lanzar un error, según tu preferencia
            }
            const roles:RoleModel[] = [] // Arreglo para almacenar los roles
            for (const userRole of userRoles) {
                const role = await RoleModel.findByPk(userRole.roleId);
                if (role) {
                    role.permissions = await new AccessCoreService().getRolePermissions(role.id); // Asignar permisos al rol
                    roles.push(role); // Asignar el rol al objeto userRole
                }
            }

            return roles
        } catch (error) {
            throw new Error(`Error fetching roles for user ID ${userId}: ${error}`);
        }
    }

    public async getPagination(paginationDto:PaginationDto): Promise<UserPaginationEntity>{
        try {
            const { itemsPerPage, page, sorting, search } = paginationDto;
            const offset = (page - 1) * itemsPerPage;
            const limit = itemsPerPage;
            const where: any = {};

            const users = await UserModel.findAndCountAll({
                where: {
                    ...(search && {
                        [Op.or]: [
                            { username: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } },
                        ],
                    }),
                    id: {
                        [Op.ne]: 1 // Excluir el usuario con ID 1 (admin)   
                    }
                },
                limit,
                offset,
                order: sorting ? [[sorting.key, sorting.order]] : undefined,
            })

            const total = users.count;
            return new UserPaginationEntity(page, total, users.rows);
        } catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    }

    public async getUserById(id: number): Promise<UserModel | null> {
        try {
            const user = await UserModel.findByPk(id);

            if (!user) {
                return null; // O lanzar un error, según tu preferencia
            }

            return user;
        } catch (error) {
            throw new Error(`Error fetching user by ID: ${error}`);
        }
    }
}