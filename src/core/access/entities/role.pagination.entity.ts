import { RoleModel } from "../model/role.model";

export default class RolePaginationEntity {
    constructor(
        public page: number,
        public total: number,
        public roles: RoleModel[],
    ){}
}