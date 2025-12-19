import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z.coerce.number().int().positive().default(3000),
	HOST: z.string().default('0.0.0.0'),
	API_VERSION: z.string().default('1.0.0'),
	API_TITLE: z.string().default('Fastify Boilerplate API'),
	API_DESCRIPTION: z
		.string()
		.default('API Boilerplate com Fastify, DDD e RBAC'),
	// Swagger/OpenAPI Configuration
	API_BASE_URL: z.string().url().optional(),
	API_DEV_URL: z.string().url().optional(),
	API_STAGING_URL: z.string().url().optional(),
	API_PRODUCTION_URL: z.string().url().optional(),
	API_CONTACT_NAME: z.string().optional(),
	API_CONTACT_EMAIL: z.string().email().optional(),
	API_CONTACT_URL: z.string().url().optional(),
	API_LICENSE_NAME: z.string().default('ISC'),
	API_LICENSE_URL: z.string().url().optional(),
	API_TERMS_OF_SERVICE: z.string().url().optional(),
	API_EXTERNAL_DOCS_URL: z.string().url().optional(),
	API_EXTERNAL_DOCS_DESCRIPTION: z.string().optional(),
	// JWT Configuration
	JWT_SECRET: z
		.string()
		.min(32, 'JWT secret must be at least 32 characters')
		.default('development-secret-key-must-be-at-least-32-characters-long'),
	JWT_EXPIRES_IN: z.string().default('7d'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.issues
				.map((issue) => issue.path.join('.'))
				.join(', ');
			throw new Error(`❌ Variáveis de ambiente inválidas: ${missingVars}`);
		}
		throw error;
	}
}

export const env = validateEnv();
