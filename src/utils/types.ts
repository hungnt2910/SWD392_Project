export interface LoginType {
    email: string,
    password: string
}

export interface RegisterType extends LoginType {
    userName: string,
    phone: string,
    address: string,
}