export declare class AuthError extends Error {
    code: number;
    constructor(message: string, code?: number);
    setCode(message: any): void;
}
