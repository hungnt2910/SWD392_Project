export interface LoginType {
    email: string,
    password: string
}

export interface RegisterType extends LoginType {
    username: string,
}

export type Product = {
    urlImage: string;
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number
}

export type Brand = {
    brandId: number,
    brandName: string,
    country: string,
    logo: string,
}
