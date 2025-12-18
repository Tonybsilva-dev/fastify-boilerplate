import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { env } from '../../../shared/env';

/**
 * Configuração do Swagger UI com opções profissionais
 */
export function getSwaggerUIConfig(): FastifySwaggerUiOptions {
	return {
		routePrefix: '/docs',
		uiConfig: {
			docExpansion: 'list', // 'none' | 'list' | 'full'
			deepLinking: true,
			defaultModelsExpandDepth: 2,
			defaultModelExpandDepth: 2,
			defaultModelRendering: 'example', // 'example' | 'model'
			displayRequestDuration: true,
			filter: true,
			showExtensions: true,
			showCommonExtensions: true,
			tryItOutEnabled: true,
		},
		uiHooks: {
			onRequest: function (request, reply, next) {
				next();
			},
			preHandler: function (request, reply, next) {
				next();
			},
		},
		staticCSP: true,
		transformStaticCSP: (header) => header,
		transformSpecification: (swaggerObject, request, reply) => {
			// Permite transformar a especificação antes de exibir
			return swaggerObject;
		},
		transformSpecificationClone: true,
	};
}
