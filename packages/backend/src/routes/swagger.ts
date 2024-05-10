import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyPlugin from 'fastify-plugin';
import config from '../config';
import { MongoTypeForRequest } from './types';

export default fastifyPlugin(async function createInvoiceClientRoute(server: FastifyInstance) {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Keagate – A high-performance crypto payment gateway',
                version: '0.1.0',
                description: '',
            },
            externalDocs: {
                url: 'https://keagate.io',
                description: 'Find more info here',
            },
            tags: [
                {
                    name: 'Payment',
                    description:
                        "Payment lifecycle administrative routes. These routes require a valid `keagate-api-key` (set in local.json) and should never be directly invoked from your payees' machine.",
                },
                {
                    name: 'Invoice',
                    description:
                        "Publicly available routes that can be safely called from your payees' devices. These do not return sensitive information. Internally, these routes are used in the built-in invoice UI.",
                },
            ],
            servers: [
                {
                    url: config.has('HOST') ? config.getTyped('HOST') : 'http://YOUR_SERVER',
                },
            ],
            security: [],
            components: {
                securitySchemes: {
                    ApiKey: {
                        type: 'apiKey',
                        name: 'keagate-api-key',
                        in: 'header',
                    },
                },
            },
        }
    });

    server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            // docExpansion: 'full',
            deepLinking: false,
        },
    });

    server.addSchema({
        $id: 'TypeForRequest',
        ...MongoTypeForRequest,
    });
});
