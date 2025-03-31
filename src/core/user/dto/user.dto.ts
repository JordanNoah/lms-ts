export default class UserDto {
    constructor(
        public username: string,
        public names: string,
        public surnames: string,
        public email: string,
        public password: string,
        public phone?: string,
        public address?: string,
        public city?: string,
        public country?: string,
        public role?: number
    ){}

    static create(object:{ [key: string]: any }): [string?, UserDto?] {
        const { username, names, surnames, email, password, phone, address, city, country, role } = object;
        const errorMessage = 'Missing in the structure';
        if (!username) return [`username ${errorMessage}`, undefined];
        if (!names) return [`names ${errorMessage}`, undefined];
        if (!surnames) return [`surnames ${errorMessage}`, undefined];
        if (!email) return [`email ${errorMessage}`, undefined];
        if (!password) return [`password ${errorMessage}`, undefined];

        return [
            undefined,
            new UserDto(
                username,
                names,
                surnames,
                email,
                password,
                phone,
                address,
                city,
                country,
                role
            )
        ];
    }
}