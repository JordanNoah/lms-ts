import { UserModel } from "../user/model/user.model";

export class LoginEntity {
    constructor(
        public token: string,
        public permissions: string[],
        public user: UserModel,
        public roles: string[] = [],
    ){}
}