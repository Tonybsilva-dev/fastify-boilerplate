import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
	createRequestSchema,
	createResponseSchema,
} from '../../../shared/utils/zod-to-json-schema';
import { createUserSchema } from '../../../core/domain/schemas/user.schema';

// Exemplo de schemas para query e params
const getUserQuerySchema = z.object({
	includeDeleted: z.boolean().optional().default(false),
});

const getUserParamsSchema = z.object({
	id: z.string().uuid(),
});

// Exemplo de resposta usando schema de domínio
const userResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	role: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

/**
 * Exemplo de rotas demonstrando o uso de schemas Zod com Swagger automático
 * Este arquivo serve como referência para criar novas rotas
 */
export async function exampleRoutes(fastify: FastifyInstance) {
	// Exemplo: GET com query params e path params
	fastify.get<{
		Params: z.infer<typeof getUserParamsSchema>;
		Querystring: z.infer<typeof getUserQuerySchema>;
	}>(
		'/users/:id',
		{
			schema: {
				description: 'Busca um usuário por ID',
				tags: ['users'],
				params: createRequestSchema({ params: getUserParamsSchema }).params,
				querystring: createRequestSchema({ query: getUserQuerySchema })
					.querystring,
				response: {
					200: createResponseSchema(userResponseSchema, 'Usuário encontrado'),
					404: createResponseSchema(
						z.object({ message: z.string() }),
						'Usuário não encontrado',
					),
				},
			},
		},
		async (request) => {
			// TypeScript sabe os tipos automaticamente!
			const { id } = request.params;
			// const { includeDeleted } = request.query; // TODO: usar quando implementar lógica

			// TODO: Implementar lógica real
			return {
				id,
				name: 'John Doe',
				email: 'john@example.com',
				role: 'USER',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
		},
	);

	// Exemplo: POST com body usando schema de domínio
	fastify.post<{
		Body: z.infer<typeof createUserSchema>;
	}>(
		'/users',
		{
			schema: {
				description: 'Cria um novo usuário',
				tags: ['users'],
				body: createRequestSchema({ body: createUserSchema }).body,
				response: {
					201: createResponseSchema(
						userResponseSchema,
						'Usuário criado com sucesso',
					),
					400: createResponseSchema(
						z.object({
							error: z.string(),
							message: z.string(),
							details: z.array(z.unknown()).optional(),
						}),
						'Erro de validação',
					),
				},
			},
		},
		async (request) => {
			// TypeScript valida automaticamente o body!
			const { name, email, role } = request.body;
			// const { password } = request.body; // TODO: usar quando implementar hash

			// TODO: Implementar lógica real
			return {
				id: crypto.randomUUID(),
				name,
				email,
				role,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
		},
	);
}
