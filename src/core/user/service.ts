import { Op } from "sequelize";
import UserDto from "./dto/user.dto";
import { UserModel } from "./model/user.model";

export default class UserService {
    public async createUser(userDto: UserDto): Promise<UserModel> {
        try {
            const user = await UserModel.create(userDto);
            return user;
        }catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    public async createAdmin(): Promise<UserModel> {}

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
}