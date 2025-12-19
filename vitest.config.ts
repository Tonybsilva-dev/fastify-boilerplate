import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		conditions: ['node', 'import', 'default'],
	},
	test: {
		environment: 'node',
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.{idea,git,cache,output,temp}/**',
			'**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/tests/**',
				'**/*.config.{js,ts}',
				'**/*.spec.{js,ts}',
				'**/*.test.{js,ts}',
				'**/index.ts',
				'**/.{idea,git,cache,output,temp}/**',
				'**/coverage/**',
				'**/src/docs/**',
				'**/src/index.ts',
			],
			include: ['src/**/*.{js,ts}'],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 75,
				statements: 80,
			},
		},
	},
});
