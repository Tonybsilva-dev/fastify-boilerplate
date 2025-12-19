import { describe, expect, it } from 'vitest';
import { UserRole } from '../../../../../src/core/domain';
import { JWTService } from '../../../../../src/core/infra/auth/jwt-service';

describe('JWTService', () => {
	const secret = 'my-super-secret-key-that-is-at-least-32-characters-long';
	const defaultExpiresIn = '1h';
	const jwtService = new JWTService(secret, defaultExpiresIn);

	describe('constructor', () => {
		it('deve lançar erro para secret vazio', () => {
			expect(() => {
				new JWTService('');
			}).toThrow('JWT secret must not be empty');
		});

		it('deve lançar erro para secret muito curto', () => {
			expect(() => {
				new JWTService('short');
			}).toThrow('JWT secret must be at least 32 characters long');
		});

		it('deve criar instância com secret válido', () => {
			expect(() => {
				new JWTService(secret);
			}).not.toThrow();
		});
	});

	describe('generate', () => {
		it('deve gerar token válido', () => {
			const payload = {
				userId: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const token = jwtService.generate(payload);

			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token.split('.')).toHaveLength(3); // JWT tem 3 partes
		});

		it('deve gerar tokens diferentes para payloads diferentes', () => {
			const payload1 = {
				userId: 'user-1',
				email: 'user1@example.com',
				role: UserRole.USER,
			};

			const payload2 = {
				userId: 'user-2',
				email: 'user2@example.com',
				role: UserRole.ADMIN,
			};

			const token1 = jwtService.generate(payload1);
			const token2 = jwtService.generate(payload2);

			expect(token1).not.toBe(token2);
		});

		it('deve aceitar expiresIn customizado', () => {
			const payload = {
				userId: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const token = jwtService.generate(payload, { expiresIn: '30m' });
			expect(token).toBeDefined();
		});
	});

	describe('validate', () => {
		it('deve validar token gerado corretamente', () => {
			const payload = {
				userId: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const token = jwtService.generate(payload);
			const result = jwtService.validate(token);

			expect(result.valid).toBe(true);
			expect(result.payload).toBeDefined();
			expect(result.payload?.userId).toBe(payload.userId);
			expect(result.payload?.email).toBe(payload.email);
			expect(result.payload?.role).toBe(payload.role);
		});

		it('deve rejeitar token vazio', () => {
			const result = jwtService.validate('');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Token is required');
		});

		it('deve rejeitar token inválido', () => {
			const result = jwtService.validate('invalid.token.here');
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid token');
		});

		it('deve rejeitar token com secret diferente', () => {
			const otherService = new JWTService(
				'different-secret-key-that-is-at-least-32-characters-long',
			);
			const payload = {
				userId: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const token = otherService.generate(payload);
			const result = jwtService.validate(token);

			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid token');
		});

		it('deve validar token com role ADMIN', () => {
			const payload = {
				userId: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const token = jwtService.generate(payload);
			const result = jwtService.validate(token);

			expect(result.valid).toBe(true);
			expect(result.payload?.role).toBe(UserRole.ADMIN);
		});
	});

	describe('decode', () => {
		it('deve decodificar token válido sem validar', () => {
			const payload = {
				userId: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const token = jwtService.generate(payload);
			const decoded = jwtService.decode(token);

			expect(decoded).toBeDefined();
			expect(decoded?.userId).toBe(payload.userId);
			expect(decoded?.email).toBe(payload.email);
			expect(decoded?.role).toBe(payload.role);
		});

		it('deve retornar null para token inválido', () => {
			const decoded = jwtService.decode('invalid.token');
			expect(decoded).toBeNull();
		});
	});
});
