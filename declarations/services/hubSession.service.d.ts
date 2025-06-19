export declare class HubSessionService {
    private static instance;
    private constructor();
    static getInstance(): HubSessionService;
    /**
     * Create a session on the hub
     *
     * @return {*}  {Promise<string>}
     * @memberof HubSessionService
     */
    createSession(): Promise<string>;
}
