import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createResponseSchema } from '../../../shared/utils/zod-to-json-schema';
import { env } from '../../../shared/env';

const healthResponseSchema = z.object({
	status: z.literal('ok'),
	version: z.string(),
	uptime: z.number(),
	timestamp: z.string().datetime(),
});

const deepHealthResponseSchema = healthResponseSchema.extend({
	checks: z.object({
		database: z.enum(['ok', 'error']).optional(),
		cache: z.enum(['ok', 'error']).optional(),
	}),
});

export async function healthcheckRoutes(fastify: FastifyInstance) {
	// Health check básico
	fastify.get(
		'/health',
		{
			schema: {
				description: 'Health check básico do serviço',
				tags: ['health'],
				response: {
					200: createResponseSchema(
						healthResponseSchema,
						'Serviço está funcionando',
					),
				},
			},
		},
		async () => {
			return {
				status: 'ok' as const,
				version: env.API_VERSION,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
			};
		},
	);

	// Health check detalhado (deep check)
	fastify.get(
		'/health/deep',
		{
			schema: {
				description: 'Health check detalhado com verificação de dependências',
				tags: ['health'],
				response: {
					200: createResponseSchema(
						deepHealthResponseSchema,
						'Serviço e dependências estão funcionando',
					),
				},
			},
		},
		async () => {
			// TODO: Adicionar verificações reais de dependências quando implementadas
			const checks = {
				// database: await checkDatabase(),
				// cache: await checkCache(),
			};

			return {
				status: 'ok' as const,
				version: env.API_VERSION,
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
				checks,
			};
		},
	);
}
