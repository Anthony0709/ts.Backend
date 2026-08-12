export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginMeta {
    ip?: string;
    userAgent?: string;
}