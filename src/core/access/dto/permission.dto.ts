export default class PermissionDto {
    constructor(
        public name: string,
        public shortName: string,
        public description?: string,
        public id?: number
    ){}

    static create(object:{ [key: string]: any }): [string?, PermissionDto?] {
        const { name, shortName, description } = object;
        const errorMessage = 'Missing in the structure';
        if (!name) return [`name ${errorMessage}`, undefined];
        if (!shortName) return [`shortName ${errorMessage}`, undefined];
        
        return [
            undefined,
            new PermissionDto(
                name,
                shortName,
                description
            )
        ];
    }
}