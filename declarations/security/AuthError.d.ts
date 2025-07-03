export declare class AuthError extends Error {
    code: number;
    constructor(message: string, code?: number);
    setCode(message: any): void;
}
export declare class OtherError extends Error {
    code: number;
    constructor(code: number, message: string);
}
