import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

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
			onRequest: (_request, _reply, next) => {
				next();
			},
			preHandler: (_request, _reply, next) => {
				next();
			},
		},
		staticCSP: true,
		transformStaticCSP: (header) => header,
		transformSpecification: (swaggerObject, _request, _reply) => {
			// Permite transformar a especificação antes de exibir
			return swaggerObject;
		},
		transformSpecificationClone: true,
	};
}
