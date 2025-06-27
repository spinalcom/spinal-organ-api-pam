export declare class AuthError extends Error {
    code: number;
    constructor(message: string);
    setCode(message: any): void;
}
export declare class OtherError extends Error {
    code: number;
    constructor(code: number, message: string);
}
