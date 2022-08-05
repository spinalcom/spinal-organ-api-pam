export declare const options: {
    info: {
        version: string;
        title: string;
        license: {
            name: string;
        };
    };
    security: {
        BasicAuth: {
            type: string;
            scheme: string;
        };
    };
    baseDir: string;
    filesPattern: string;
    swaggerUIPath: string;
    exposeSwaggerUI: boolean;
    exposeApiDocs: boolean;
    apiDocsPath: string;
    notRequiredAsNullable: boolean;
    swaggerUiOptions: {};
    multiple: boolean;
};
