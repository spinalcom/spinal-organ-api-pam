export declare class Utils {
    private static getDuplicateError;
    static getReturnObj(err: any, data?: any, type?: string, msg?: string): any;
    static getErrObj(e: any, functionName?: string): {
        code: number;
        msg: any;
    };
    static logger(sType?: string, ...aMsg: any[]): void;
    static preg_quote(str: any, delimiter: any): string;
    static strpos(haystack: string, needle: string, offset?: number): number | false;
    static isOnGoing(begin: Date, end: Date): boolean;
}
