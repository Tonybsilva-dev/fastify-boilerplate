#!/usr/bin/env tsx
/**
 * Script para gerar a especificação OpenAPI do servidor Fastify
 * Usado pela GitHub Action para detectar mudanças nas rotas
 */

import { build } from '../src/app/http/server';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

async function generateOpenAPISpec() {
	try {
		const app = await build();
		const spec = app.swagger();

		const outputPath = join(process.cwd(), 'openapi-spec.json');
		writeFileSync(outputPath, JSON.stringify(spec, null, 2));

		console.log(`✅ OpenAPI spec gerada em: ${outputPath}`);
		console.log(`📊 Total de rotas: ${Object.keys(spec.paths || {}).length}`);

		await app.close();
		process.exit(0);
	} catch (error) {
		console.error('❌ Erro ao gerar OpenAPI spec:', error);
		process.exit(1);
	}
}

generateOpenAPISpec();
