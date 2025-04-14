export default class CategoryCourseDto {
    constructor(
        public name: string,
        public description: string | null,
        public idNumber: string | null,
        public id?: number,
    ){}

    static create(object:{ [key: string]: any }): [string?, CategoryCourseDto?] {
        const { name, description, idNumber, id } = object;
        const errorMessage = 'Missing in the structure';
        if (!name) return [`name ${errorMessage}`, undefined];

        return [
            undefined,
            new CategoryCourseDto(
                name,
                description,
                idNumber,
                id
            )
        ];
    }
}