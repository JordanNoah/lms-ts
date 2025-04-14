import { PermissionModel } from "../model/permission.model";

export default class PermissionPaginationEntity {
    constructor(
        public page: number,
        public total: number,
        public permissions: PermissionModel[],
    ){}
}