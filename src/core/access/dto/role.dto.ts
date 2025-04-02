import PermissionDto from "./permission.dto";

export default class RoleDto {
    constructor(
        public name: string,
        public shortName: string,
        public description: string,
        public permissions: PermissionDto[],
        public id?: number,
    ){}

    static create(object:{ [key: string]: any }): [string?, RoleDto?] {
        const { name, shortName, description, permissions } = object;
        const errorMessage = 'Missing in the structure';
        if (!name) return [`name ${errorMessage}`, undefined];
        if (!shortName) return [`shortName ${errorMessage}`, undefined];
        if (!description) return [`description ${errorMessage}`, undefined];
        if (!permissions) return [`permissions ${errorMessage}`, undefined];

        const permissionsArray = []

        if (permissions.length > 0) {
            for (const permission of permissions) {
                const [error, permissionDto] = PermissionDto.create(permission);
                if (error) return [error, undefined];
                permissionsArray.push(permissionDto!);
            }
        }

        return [
            undefined,
            new RoleDto(
                name,
                shortName,
                description,
                permissionsArray
            )
        ];
    }
}