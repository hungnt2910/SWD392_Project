export interface LoginType {
    email: string,
    password: string
}

export interface RegisterType extends LoginType {
    username: string,
}
