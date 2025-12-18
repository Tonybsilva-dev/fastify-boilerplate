import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from '../../shared/env';
import { getSwaggerConfig } from './config/swagger.config';
import { getSwaggerUIConfig } from './config/swagger-ui.config';
import { healthcheckRoutes } from './healthcheck/healthcheck.routes';

const server = Fastify({
	logger: {
		level: env.NODE_ENV === 'production' ? 'info' : 'debug',
		transport:
			env.NODE_ENV === 'development'
				? {
						target: 'pino-pretty',
						options: {
							translateTime: 'HH:MM:ss Z',
							ignore: 'pid,hostname',
						},
					}
				: undefined,
	},
});

async function build() {
	// Registra Swagger com configuração completa e profissional
	// biome-ignore lint/suspicious/noExplicitAny: Necessário para compatibilidade com tipos do Fastify Swagger
	await server.register(swagger, getSwaggerConfig() as any);

	// Registra Swagger UI com configuração otimizada
	await server.register(swaggerUI, getSwaggerUIConfig());

	// Registra rotas
	await server.register(healthcheckRoutes);

	// TODO: Registrar outras rotas aqui
	// await server.register(exampleRoutes);
	// await server.register(userRoutes);
	// await server.register(authRoutes);

	// Rota raiz
	server.get(
		'/',
		{
			schema: {
				description: 'Rota raiz da API',
				tags: ['root'],
				response: {
					200: {
						type: 'object',
						properties: {
							message: { type: 'string' },
							version: { type: 'string' },
							docs: { type: 'string' },
						},
					},
				},
			},
		},
		async () => {
			return {
				message: 'Fastify Boilerplate API',
				version: env.API_VERSION,
				docs: '/docs',
			};
		},
	);

	return server;
}

async function start() {
	try {
		const app = await build();
		await app.listen({
			port: env.PORT,
			host: env.HOST,
		});

		app.log.info(`🚀 Servidor rodando em http://${env.HOST}:${env.PORT}`);
		app.log.info(
			`📚 Documentação disponível em http://${env.HOST}:${env.PORT}/docs`,
		);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

// Inicia o servidor se este arquivo for executado diretamente
if (require.main === module) {
	start();
}

export { build, start };
