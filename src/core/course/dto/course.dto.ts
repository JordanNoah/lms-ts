export default class CourseDto {
    constructor(
        public name: string,
        public sectionId: number,
        public shortName: string,
        public description?: string,
        public idNumber?: string | null,
        public id?: number,
    ){}

    static create(object:{ [key: string]: any }): [string?, CourseDto?] {
        const { name, sectionId, description, id, idNumber } = object;
        const errorMessage = 'Missing in the structure';
        if (!name) return [`name ${errorMessage}`, undefined];
        if (!sectionId) return [`sectionId ${errorMessage}`, undefined];

        return [
            undefined,
            new CourseDto(
                name,
                sectionId,
                description,
                idNumber,
                id
            )
        ];
    }
}