export default function launchExpressServer(serverPort: string, serverProtocol?: "http" | "https"): Promise<{
    server: any;
    app: import("express-serve-static-core").Express;
}>;
