import { Op } from "sequelize";
import UserDto from "./dto/user.dto";
import { UserModel } from "./model/user.model";
import AccessCoreService from "../access/service";
import { UserRoleModel } from "./model/user.role.model";
import { RoleModel } from "../access/model/role.model";

export default class UserService {
    public async createUser(userDto: UserDto): Promise<UserModel> {
        try {
            let role = null
            if(userDto.role) {
                role = await AccessCoreService.getRoleById(userDto.role)
            }else{
                role = await AccessCoreService.getRoleByShortName("visitor")
            }
            const user = await UserModel.create(userDto);
            return user;
        }catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    public async createAdmin(): Promise<UserModel> {
        try {
            const existAdmin = await this.getUsersByRole(1);
            if (existAdmin.length > 0) {
                throw new Error("Admin user already exists");
            }
            const adminRole = await AccessCoreService.getRoleById(1)
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
                    username: "changeme",
                }
            })

            await this.setRoleToUser(user.id,adminRole.id)

            return user;
        } catch (error) {
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
}