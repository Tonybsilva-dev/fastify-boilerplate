import { env } from '../../../shared/env';

/**
 * Configuração completa e profissional do Swagger/OpenAPI
 * Inclui informações detalhadas sobre a API, servidores, contato, licença, etc.
 */
export function getSwaggerConfig() {
	const baseUrl = env.API_BASE_URL || `http://${env.HOST}:${env.PORT}`;
	const devUrl = env.API_DEV_URL || baseUrl;
	const stagingUrl = env.API_STAGING_URL;
	const productionUrl = env.API_PRODUCTION_URL;

	// Configuração de servidores (múltiplos ambientes)
	const servers = [
		{
			url: devUrl,
			description: 'Servidor de Desenvolvimento',
		},
	];

	if (stagingUrl) {
		servers.push({
			url: stagingUrl,
			description: 'Servidor de Staging',
		});
	}

	if (productionUrl) {
		servers.push({
			url: productionUrl,
			description: 'Servidor de Produção',
		});
	}

	// Configuração de contato
	const contact =
		env.API_CONTACT_NAME || env.API_CONTACT_EMAIL || env.API_CONTACT_URL
			? {
					name: env.API_CONTACT_NAME,
					email: env.API_CONTACT_EMAIL,
					url: env.API_CONTACT_URL,
				}
			: undefined;

	// Configuração de licença
	const license = env.API_LICENSE_NAME
		? {
				name: env.API_LICENSE_NAME,
				url: env.API_LICENSE_URL,
			}
		: undefined;

	// Configuração de documentação externa
	const externalDocs = env.API_EXTERNAL_DOCS_URL
		? {
				url: env.API_EXTERNAL_DOCS_URL,
				description:
					env.API_EXTERNAL_DOCS_DESCRIPTION || 'Documentação adicional da API',
			}
		: undefined;

	return {
		openapi: {
			openapi: '3.1.0',
			info: {
				title: env.API_TITLE,
				description: env.API_DESCRIPTION,
				version: env.API_VERSION,
				contact,
				license,
				termsOfService: env.API_TERMS_OF_SERVICE,
			},
			servers,
			tags: [
				{
					name: 'health',
					description:
						'Endpoints de health check para monitoramento do status do serviço e suas dependências',
					externalDocs: {
						description: 'Saiba mais sobre health checks',
						url: 'https://microservices.io/patterns/observability/health-check-api.html',
					},
				},
				{
					name: 'users',
					description:
						'Gerenciamento de usuários: criação, listagem, atualização e exclusão',
				},
				{
					name: 'auth',
					description:
						'Autenticação e autorização: login, registro, refresh token e gerenciamento de sessão',
				},
				{
					name: 'root',
					description: 'Informações gerais da API e endpoints raiz',
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http' as const,
						scheme: 'bearer' as const,
						bearerFormat: 'JWT',
						description: 'Autenticação via JWT. Use o formato: Bearer {token}',
					},
					apiKey: {
						type: 'apiKey' as const,
						name: 'X-API-Key',
						in: 'header' as const,
						description:
							'Chave de API para autenticação de serviços. Use no header: X-API-Key: {key}',
					},
				},
				schemas: {
					Error: {
						type: 'object' as const,
						required: ['error', 'message'],
						properties: {
							error: {
								type: 'string',
								description: 'Tipo do erro',
								example: 'ValidationError',
							},
							message: {
								type: 'string',
								description: 'Mensagem descritiva do erro',
								example: 'E-mail inválido',
							},
							details: {
								type: 'array',
								description: 'Detalhes adicionais do erro (opcional)',
								items: {
									type: 'object',
								},
							},
							traceId: {
								type: 'string',
								format: 'uuid',
								description:
									'ID único para rastreamento do erro (correlação de logs)',
								example: '123e4567-e89b-12d3-a456-426614174000',
							},
						},
					},
					ValidationError: {
						type: 'object' as const,
						required: ['error', 'message', 'details'],
						properties: {
							error: {
								type: 'string',
								example: 'ValidationError',
							},
							message: {
								type: 'string',
								example: 'Erro de validação nos dados fornecidos',
							},
							details: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										field: {
											type: 'string',
											example: 'email',
										},
										rule: {
											type: 'string',
											example: 'email',
										},
										message: {
											type: 'string',
											example: 'E-mail inválido',
										},
									},
								},
							},
							traceId: {
								type: 'string',
								format: 'uuid',
							},
						},
					},
					UnauthorizedError: {
						type: 'object' as const,
						required: ['error', 'message'],
						properties: {
							error: {
								type: 'string',
								example: 'UnauthorizedError',
							},
							message: {
								type: 'string',
								example: 'Token de autenticação inválido ou expirado',
							},
							traceId: {
								type: 'string',
								format: 'uuid',
							},
						},
					},
					ForbiddenError: {
						type: 'object' as const,
						required: ['error', 'message'],
						properties: {
							error: {
								type: 'string',
								example: 'ForbiddenError',
							},
							message: {
								type: 'string',
								example: 'Você não tem permissão para acessar este recurso',
							},
							traceId: {
								type: 'string',
								format: 'uuid',
							},
						},
					},
					NotFoundError: {
						type: 'object' as const,
						required: ['error', 'message'],
						properties: {
							error: {
								type: 'string',
								example: 'NotFoundError',
							},
							message: {
								type: 'string',
								example: 'Recurso não encontrado',
							},
							traceId: {
								type: 'string',
								format: 'uuid',
							},
						},
					},
					PageRequest: {
						type: 'object' as const,
						properties: {
							page: {
								type: 'integer',
								minimum: 1,
								default: 1,
								description: 'Número da página',
							},
							perPage: {
								type: 'integer',
								minimum: 1,
								maximum: 100,
								default: 10,
								description: 'Itens por página',
							},
							sort: {
								type: 'string',
								description: 'Campo para ordenação (ex: "createdAt:desc")',
							},
							filter: {
								type: 'string',
								description:
									'Filtros adicionais (formato específico por endpoint)',
							},
						},
					},
					PageResponse: {
						type: 'object' as const,
						required: ['items', 'total', 'page', 'perPage'],
						properties: {
							items: {
								type: 'array',
								description: 'Lista de itens da página',
							},
							total: {
								type: 'integer',
								description: 'Total de itens disponíveis',
							},
							page: {
								type: 'integer',
								description: 'Página atual',
							},
							perPage: {
								type: 'integer',
								description: 'Itens por página',
							},
							totalPages: {
								type: 'integer',
								description: 'Total de páginas',
							},
						},
					},
				},
				responses: {
					BadRequest: {
						description: 'Requisição inválida',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ValidationError',
								},
							},
						},
					},
					Unauthorized: {
						description: 'Não autenticado',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UnauthorizedError',
								},
							},
						},
					},
					Forbidden: {
						description: 'Não autorizado',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/ForbiddenError',
								},
							},
						},
					},
					NotFound: {
						description: 'Recurso não encontrado',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/NotFoundError',
								},
							},
						},
					},
					InternalServerError: {
						description: 'Erro interno do servidor',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Error',
								},
							},
						},
					},
				},
			},
			externalDocs,
		},
	};
}
