export declare class HubSessionService {
    private static instance;
    private constructor();
    static getInstance(): HubSessionService;
    createSession(): Promise<string>;
}
