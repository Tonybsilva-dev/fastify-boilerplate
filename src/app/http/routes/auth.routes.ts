import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
	GetCurrentUserUseCase,
	LoginUseCase,
	RegisterUserUseCase,
} from '../../../core/application/use-cases/auth';
import { AccountStatus, UserRole } from '../../../core/domain';
import {
	createRequestSchema,
	createResponseSchema,
} from '../../../shared/utils/zod-to-json-schema';
import type { AppContainer } from '../container';
import { authMiddleware } from '../middlewares/auth';

// Schemas para requisições
const registerRequestSchema = z.object({
	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
	role: z.nativeEnum(UserRole).optional(),
	accountStatus: z.nativeEnum(AccountStatus).optional(),
});

const loginRequestSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(1, 'Senha é obrigatória'),
});

// Schemas para respostas
const registerResponseSchema = z.object({
	user: z.object({
		id: z.string().uuid(),
		name: z.string(),
		email: z.string().email(),
		role: z.string(),
		accountStatus: z.string(),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	}),
	token: z.string(),
});

const loginResponseSchema = z.object({
	user: z.object({
		id: z.string().uuid(),
		name: z.string(),
		email: z.string().email(),
		role: z.string(),
		accountStatus: z.string(),
	}),
	token: z.string(),
});

const currentUserResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	role: z.string(),
	accountStatus: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

// Schemas para erros (usados em testes quando $ref não está disponível)
const validationErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	details: z.array(z.unknown()).optional(),
	traceId: z.string().optional(),
});

const unauthorizedErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	traceId: z.string().optional(),
});

const notFoundErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	traceId: z.string().optional(),
});

/**
 * Rotas de autenticação
 * POST /auth/register - Registra novo usuário
 * POST /auth/login - Autentica usuário
 * GET /auth/me - Obtém dados do usuário autenticado
 */
export async function authRoutes(
	fastify: FastifyInstance,
	options: { container: AppContainer },
) {
	const { container } = options;

	if (!container.userRepository) {
		throw new Error(
			'UserRepository não está configurado. Configure via container.setUserRepository()',
		);
	}

	const registerUseCase = new RegisterUserUseCase(
		container.userRepository,
		container.passwordHasher,
		container.jwtService,
	);

	const loginUseCase = new LoginUseCase(
		container.userRepository,
		container.passwordHasher,
		container.jwtService,
	);

	const getCurrentUserUseCase = new GetCurrentUserUseCase(
		container.userRepository,
	);

	// POST /auth/register
	// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
	(fastify as any).post(
		'/auth/register',
		{
			schema: {
				description: 'Registra um novo usuário na aplicação',
				tags: ['auth'],
				body: createRequestSchema({ body: registerRequestSchema }).body,
				response: {
					201: createResponseSchema(
						registerResponseSchema,
						'Usuário registrado com sucesso',
					),
					400: createResponseSchema(
						validationErrorSchema,
						'Erro de validação ou email duplicado',
					),
				},
			},
		},
		// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
		async (request: any, reply: any) => {
			const result = await registerUseCase.execute(request.body);

			return reply.code(201).send({
				user: {
					...result.user,
					createdAt: result.user.createdAt.toISOString(),
					updatedAt: result.user.updatedAt.toISOString(),
				},
				token: result.token,
			});
		},
	);

	// POST /auth/login
	// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
	(fastify as any).post(
		'/auth/login',
		{
			schema: {
				description: 'Autentica um usuário e retorna token JWT',
				tags: ['auth'],
				body: createRequestSchema({ body: loginRequestSchema }).body,
				response: {
					200: createResponseSchema(
						loginResponseSchema,
						'Login realizado com sucesso',
					),
					400: createResponseSchema(validationErrorSchema, 'Erro de validação'),
					401: createResponseSchema(
						unauthorizedErrorSchema,
						'Credenciais inválidas',
					),
				},
			},
		},
		// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
		async (request: any) => {
			// Valida o body manualmente para garantir que erros de validação retornem 400
			const validationResult = loginRequestSchema.safeParse(request.body);
			if (!validationResult.success) {
				// Lança ZodError que será capturado pelo error handler e retornará 400
				throw validationResult.error;
			}

			const result = await loginUseCase.execute(validationResult.data);

			return {
				user: result.user,
				token: result.token,
			};
		},
	);

	// GET /auth/me
	// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
	(fastify as any).get(
		'/auth/me',
		{
			schema: {
				description: 'Obtém dados do usuário autenticado',
				tags: ['auth'],
				security: [{ bearerAuth: [] }],
				response: {
					200: createResponseSchema(
						currentUserResponseSchema,
						'Dados do usuário autenticado',
					),
					401: createResponseSchema(unauthorizedErrorSchema, 'Não autenticado'),
					404: createResponseSchema(
						notFoundErrorSchema,
						'Usuário não encontrado',
					),
				},
			},
			preHandler: async (request: FastifyRequest, _reply: unknown) => {
				await authMiddleware(request, _reply, container.jwtService);
			},
		},
		// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
		async (request: any) => {
			const user = (request as { user?: { userId: string } }).user;
			if (!user) {
				throw new Error('Usuário não autenticado');
			}

			const result = await getCurrentUserUseCase.execute({
				userId: user.userId,
			});

			return {
				...result,
				createdAt: result.createdAt.toISOString(),
				updatedAt: result.updatedAt.toISOString(),
			};
		},
	);
}
