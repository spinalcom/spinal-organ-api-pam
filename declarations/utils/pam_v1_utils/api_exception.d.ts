export declare class APIException {
    private _code;
    private _data;
    private _message;
    private _description;
    protected _aCodes: {
        Informational: {
            code: number;
            message: string;
            description: string;
        }[];
        Success: ({
            code: number;
            message: string;
            description: string;
        } | {
            code: number;
            message: string;
            description?: undefined;
        })[];
        Redirection: {
            code: number;
            message: string;
            description: string;
        }[];
        error: {
            code: number;
            message: string;
            description: string;
        }[];
    };
    getCode(): number;
    setCode(code: number): void;
    getData(): any;
    setData(obj: any): void;
    getMessage(): string;
    setMessage(msg: string): void;
    getCodeMsg(): string;
    setCodeMsg(msg: string): void;
    private setAll;
    getAll(): any;
    constructor(codeMsg?: string, customErr?: string);
}
