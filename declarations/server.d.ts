export default function initExpress(conn: spinal.FileSystem): Promise<{
    server: any;
    app: import("express-serve-static-core").Express;
}>;
