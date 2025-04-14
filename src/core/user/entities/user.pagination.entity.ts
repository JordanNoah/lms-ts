import { UserModel } from "../model/user.model";

export default class UserPaginationEntity {
    constructor(
        public page: number,
        public total: number,
        public users: UserModel[],
    ){}
}