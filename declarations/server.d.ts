/// <reference types="node" />
/// <reference types="node" />
import * as https from "https";
export default function initExpress(conn: spinal.FileSystem): Promise<{
    server: https.Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    app: import("express-serve-static-core").Express;
}>;
