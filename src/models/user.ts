export interface LoginContract {
    username: string;
    password: string;
}

export interface UserContract {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
}

export class User implements UserContract {
    id: number;
    enabled: boolean;
    firstName: string;
    lastName: string;
    username: string;

    private constructor(
        id: number,
        enabled: boolean,
        firstName: string,
        lastName: string,
        username: string,
    ) {
        this.id = id;
        this.enabled = enabled;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
    }

    public static readonly fromContract = (c: UserContract) =>
        new User(c.id, c.enabled, c.firstName, c.lastName, c.username);

    public get fullName() {
        return `${this.firstName} ${this.lastName} (${this.username})`;
    }
}
