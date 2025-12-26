import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { env } from '../../shared/env';
import { getSwaggerConfig } from './config/swagger.config';
import { getSwaggerUIConfig } from './config/swagger-ui.config';
import { AppContainer } from './container';
import { healthcheckRoutes } from './healthcheck/healthcheck.routes';
import { errorHandler } from './middlewares/error-handler';
import traceIdPlugin from './middlewares/trace-id';
import { authRoutes } from './routes/auth.routes';

// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos, necessário type assertion
const server = (fastify as any)({
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
	// Configurações de timeout e limites para resiliência
	bodyLimit: 1024 * 1024, // 1MB
	connectionTimeout: 10000, // 10s
	keepAliveTimeout: 5000, // 5s
	requestTimeout: 30000, // 30s
	trustProxy: true, // Confiar em proxies (útil para Docker, load balancers, etc.)
	// Configura Ajv para ignorar propriedades desconhecidas como 'example' e 'examples'
	// Isso permite adicionar exemplos nos schemas sem quebrar a validação
	ajv: {
		customOptions: {
			strict: false, // Desabilita strict mode para permitir propriedades como 'example'
			removeAdditional: false,
		},
	},
});

async function build() {
	// Registra Security Headers com Helmet
	await server.register(helmet, {
		contentSecurityPolicy: false, // Pode ser configurado depois se necessário
		crossOriginEmbedderPolicy: false,
	});

	// Registra CORS
	await server.register(cors, {
		origin: env.NODE_ENV === 'production' ? false : true, // Em produção, configurar origins específicos
		credentials: true,
	});

	// Registra Rate Limiting Global
	await server.register(rateLimit, {
		max: 100, // 100 requisições
		timeWindow: '1 minute', // por minuto
		// biome-ignore lint/suspicious/noExplicitAny: Fastify rate-limit types
		errorResponseBuilder: (_request: any, context: any) => {
			return {
				code: 429,
				error: 'Too Many Requests',
				message: `Rate limit exceeded, retry in ${context.ttl} seconds`,
				date: Date.now(),
				expiresIn: context.ttl,
			};
		},
	});

	// Registra Swagger com configuração completa e profissional
	// biome-ignore lint/suspicious/noExplicitAny: Necessário para compatibilidade com tipos do Fastify Swagger
	await server.register(swagger, getSwaggerConfig() as any);

	// Registra Swagger UI com configuração otimizada
	await server.register(swaggerUI, getSwaggerUIConfig());

	// Registra middleware de traceId (deve ser registrado antes das rotas)
	await server.register(traceIdPlugin);

	// Registra middleware global de erros
	server.setErrorHandler(errorHandler);

	// Registra rotas
	await server.register(healthcheckRoutes);

	// Inicializa container de dependências
	// TODO: Em produção, configurar UserRepository real aqui
	// Exemplo: container.setUserRepository(new PrismaUserRepository(prisma));
	// Por enquanto, registramos as rotas para aparecerem no Swagger
	// As rotas retornarão erro se tentarem executar sem UserRepository configurado
	const container = new AppContainer();
	// Nota: UserRepository não está configurado, então as rotas aparecerão no Swagger
	// mas retornarão erro ao tentar executar. Configure um repositório real para uso.
	await server.register(authRoutes, { container });

	// TODO: Registrar outras rotas aqui
	// await server.register(exampleRoutes);
	// await server.register(userRoutes);

	// Rotas de exemplo de erros (apenas para desenvolvimento/documentação)
	if (env.NODE_ENV !== 'production') {
		const { errorExampleRoutes } = await import(
			'./routes/error-example.routes'
		);
		await server.register(errorExampleRoutes);
	}

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
