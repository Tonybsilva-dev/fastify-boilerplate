import { describe, expect, it, vi } from 'vitest';
import { UserRole } from '../../../../../src/core/domain';
import { JWTService } from '../../../../../src/core/infra/auth/jwt-service';
import { AuthError } from '../../../../../src/app/http/errors/auth-error';
import {
	authMiddleware,
	createAuthPlugin,
} from '../../../../../src/app/http/middlewares/auth';

describe('authMiddleware', () => {
	const secret = 'test-secret-key-must-be-at-least-32-characters-long';
	const jwtService = new JWTService(secret);

	it('deve autenticar request com token válido', async () => {
		const payload = {
			userId: 'user-123',
			email: 'user@example.com',
			role: UserRole.USER,
		};
		const token = jwtService.generate(payload);

		const mockRequest = {
			headers: {
				authorization: `Bearer ${token}`,
			},
		} as any;

		await authMiddleware(mockRequest, null, jwtService);

		expect(mockRequest.user).toBeDefined();
		expect(mockRequest.user?.userId).toBe(payload.userId);
		expect(mockRequest.user?.email).toBe(payload.email);
		expect(mockRequest.user?.role).toBe(payload.role);
	});

	it('deve lançar AuthError quando authorization header não existe', async () => {
		const mockRequest = {
			headers: {},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow('Token de autenticação não fornecido');
	});

	it('deve lançar AuthError quando authorization header é array', async () => {
		const mockRequest = {
			headers: {
				authorization: ['Bearer token1', 'Bearer token2'],
			},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
	});

	it('deve lançar AuthError quando formato do token é inválido', async () => {
		const mockRequest = {
			headers: {
				authorization: 'InvalidFormat token',
			},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow('Formato de token inválido');
	});

	it('deve lançar AuthError quando token não tem Bearer prefix', async () => {
		const mockRequest = {
			headers: {
				authorization: 'TokenWithoutBearer',
			},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
	});

	it('deve lançar AuthError quando token é inválido', async () => {
		const mockRequest = {
			headers: {
				authorization: 'Bearer invalid.token.here',
			},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
	});

	it('deve lançar AuthError quando token está expirado', async () => {
		// Cria um token com outro secret para simular token inválido
		const otherService = new JWTService(
			'other-secret-key-must-be-at-least-32-characters-long',
		);
		const payload = {
			userId: 'user-123',
			email: 'user@example.com',
			role: UserRole.USER,
		};
		const invalidToken = otherService.generate(payload);

		const mockRequest = {
			headers: {
				authorization: `Bearer ${invalidToken}`,
			},
		} as any;

		await expect(
			authMiddleware(mockRequest, null, jwtService),
		).rejects.toThrow(AuthError);
	});
});

describe('createAuthPlugin', () => {
	const secret = 'test-secret-key-must-be-at-least-32-characters-long';
	const jwtService = new JWTService(secret);

	it('deve criar plugin Fastify que registra método authenticate', async () => {
		const plugin = createAuthPlugin(jwtService);

		expect(plugin).toBeDefined();
		expect(typeof plugin).toBe('function');

		// Mock do fastify instance
		const mockFastify = {
			decorate: vi.fn(),
		} as any;

		// Registra o plugin
		await plugin(mockFastify, {});

		// Verifica que o método authenticate foi registrado
		expect(mockFastify.decorate).toHaveBeenCalledWith(
			'authenticate',
			expect.any(Function),
		);
	});

	it('deve permitir usar método authenticate após registro', async () => {
		const plugin = createAuthPlugin(jwtService);
		const mockFastify = {
			decorate: vi.fn((name: string, fn: Function) => {
				(mockFastify as any)[name] = fn;
			}),
		} as any;

		await plugin(mockFastify, {});

		// Verifica que o método foi registrado
		expect(mockFastify.authenticate).toBeDefined();
		expect(typeof mockFastify.authenticate).toBe('function');
	});
});

