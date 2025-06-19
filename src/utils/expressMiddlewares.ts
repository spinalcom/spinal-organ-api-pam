/////////////////////////////////////
//          Middleware             //
/////////////////////////////////////
import * as express from 'express';
import { ValidateError } from 'tsoa';
import { HTTP_CODES, routesToProxy } from '../constant';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { AuthError } from '../security/AuthError';
var proxy = require('express-http-proxy');


export function useProxyToHub(app: express.Express) {
    const HUB_HOST = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: (req: any) => req.originalUrl
    });

    for (const routeToProxy of routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}

export function useViewMiddleWare(app: express.Express) {
    // const oneDay = 1000 * 60 * 60 * 24;
    const root = path.resolve(__dirname, '..');
    app.use(express.static(root));

    app.get('/', (req, res) => {
        res.redirect('/docs');
    });
}

export function initSwagger(app: express.Express) {
    app.use('/swagger.json', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../swagger/swagger.json'));
    });

    app.get('/logo.png', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, './assets') });
    });

    app.use('/docs', swaggerUi.serve, async (req, res) => {
        return res.send(
            swaggerUi.generateHTML(await import('../swagger/swagger.json'))
        );
    });
}

export function useApiMiddleWare(app: express.Express) {
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ extended: true, limit: '500mb' }));
}

export function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void {
    if (err instanceof ValidateError) {
        return res.status(HTTP_CODES.BAD_REQUEST).send(_formatValidationError(err));
    }

    if (err instanceof AuthError) {
        return res.status(HTTP_CODES.UNAUTHORIZED).send({ message: err.message });
    }

    if (err instanceof Error) {
        return res.status(HTTP_CODES.INTERNAL_ERROR).json({
            message: 'Internal Server Error',
        });
    }

    next();
}

function _formatValidationError(err: ValidateError) {
    err;
    return {
        message: 'Validation Failed',
        details: err?.fields,
    };
}