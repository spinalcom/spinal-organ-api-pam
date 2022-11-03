/// <reference types="node" />
export default function initExpress(): {
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    app: import("express-serve-static-core").Express;
};
