import { Request } from 'express';
export declare function checkIfProfileHasAccess(req: Request, profileId: string): Promise<boolean>;
