import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Converte um schema Zod para JSON Schema compatível com Fastify Swagger
 * @param schema - Schema Zod a ser convertido
 * @param options - Opções adicionais para a conversão
 * @returns JSON Schema compatível com OpenAPI
 */
export function zodToJsonSchemaFastify(
	schema: z.ZodTypeAny,
	options?: {
		name?: string;
		description?: string;
		$ref?: boolean;
	},
) {
	// Cast necessário devido à incompatibilidade de tipos entre versões do Zod
	// biome-ignore lint/suspicious/noExplicitAny: Necessário para compatibilidade com zod-to-json-schema
	const jsonSchema = zodToJsonSchema(schema as any, {
		target: 'openApi3',
		$refStrategy: options?.$ref ? 'root' : 'none',
		name: options?.name,
	});

	// Adiciona descrição se fornecida
	if (options?.description) {
		return {
			...jsonSchema,
			description: options.description,
		};
	}

	return jsonSchema;
}

/**
 * Cria um schema de resposta padronizado para Fastify
 * @param schema - Schema Zod para o body da resposta
 * @param description - Descrição da resposta
 * @returns Schema de resposta formatado para Fastify
 */
export function createResponseSchema(
	schema: z.ZodTypeAny,
	description?: string,
) {
	return {
		description: description || 'Success response',
		content: {
			'application/json': {
				schema: zodToJsonSchemaFastify(schema),
			},
		},
	};
}

/**
 * Cria um schema de request padronizado para Fastify
 * @param options - Opções com schemas Zod para body, query, params e headers
 * @returns Schema de request formatado para Fastify
 */
export function createRequestSchema(options?: {
	body?: z.ZodTypeAny;
	query?: z.ZodTypeAny;
	params?: z.ZodTypeAny;
	headers?: z.ZodTypeAny;
}) {
	const schema: {
		body?: unknown;
		querystring?: unknown;
		params?: unknown;
		headers?: unknown;
	} = {};

	if (options?.body) {
		schema.body = zodToJsonSchemaFastify(options.body);
	}

	if (options?.query) {
		schema.querystring = zodToJsonSchemaFastify(options.query);
	}

	if (options?.params) {
		schema.params = zodToJsonSchemaFastify(options.params);
	}

	if (options?.headers) {
		schema.headers = zodToJsonSchemaFastify(options.headers);
	}

	return schema;
}
