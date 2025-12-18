import type { FastifyInstance, FastifyRequest } from 'fastify';
import '../types';
import { getOrGenerateTraceId } from '../../../shared/utils/trace-id';

/**
 * Middleware para adicionar traceId automaticamente em todas as requisições
 * O traceId pode ser fornecido via header X-Trace-Id ou será gerado automaticamente
 */
export async function traceIdMiddleware(
	request: FastifyRequest,
	_reply: unknown,
) {
	const headers = (
		request as { headers?: Record<string, string | string[] | undefined> }
	).headers;
	const traceId = getOrGenerateTraceId(
		headers?.['x-trace-id'] as string | undefined,
	);
	(request as { traceId?: string }).traceId = traceId;

	// Adiciona traceId ao logger context para aparecer automaticamente nos logs
	const logger = (
		request as {
			log?: { child: (bindings: Record<string, unknown>) => unknown };
		}
	).log;
	if (logger) {
		(request as { log: unknown }).log = logger.child({ traceId });
	}
}

/**
 * Plugin Fastify para registrar o middleware de traceId
 */
export async function traceIdPlugin(fastify: FastifyInstance) {
	// biome-ignore lint/suspicious/noExplicitAny: Fastify 5.x tem problemas de tipos
	(fastify as any).addHook('onRequest', traceIdMiddleware);
}
