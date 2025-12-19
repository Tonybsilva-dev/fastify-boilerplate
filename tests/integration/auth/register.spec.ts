import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AccountStatus, UserRole } from '../../../src/core/domain/index.ts';
import { UserFactory } from '../../factories';
import { MockUserRepository } from '../../unit/core/domain/repositories/mock-user-repository';
import { createTestServer, makeRequest } from '../helpers';

describe('POST /auth/register - Integração', () => {
	let server: FastifyInstance;
	let userRepository: MockUserRepository;

	beforeEach(async () => {
		userRepository = new MockUserRepository();
		server = await createTestServer(userRepository);
	});

	afterEach(async () => {
		await server.close();
		userRepository.clear();
	});

	describe('Happy Path', () => {
		it('deve registrar um novo usuário com sucesso', async () => {
			const registerData = UserFactory.createRegisterData({
				name: 'Jane Doe',
				email: 'jane.doe@example.com',
				password: 'securePassword123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty('user');
			expect(response.body).toHaveProperty('token');
			expect((response.body as { user: unknown }).user).toMatchObject({
				name: 'Jane Doe',
				email: 'jane.doe@example.com',
				role: UserRole.USER,
				accountStatus: AccountStatus.ACTIVE,
			});
			expect((response.body as { user: { id: string } }).user.id).toBeDefined();
			expect((response.body as { token: string }).token).toBeTypeOf('string');
			expect((response.body as { token: string }).token.length).toBeGreaterThan(
				0,
			);
		});

		it('deve definir role USER e status ACTIVE por padrão', async () => {
			const registerData = UserFactory.createRegisterData({
				name: 'Default User',
				email: 'default@example.com',
				password: 'password123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(201);
			const user = (response.body as { user: unknown }).user as {
				role: string;
				accountStatus: string;
			};
			expect(user.role).toBe(UserRole.USER);
			expect(user.accountStatus).toBe(AccountStatus.ACTIVE);
		});

		it('deve permitir registrar com role e accountStatus customizados', async () => {
			const registerData = UserFactory.createRegisterData({
				name: 'Admin User',
				email: 'admin@example.com',
				password: 'adminPassword123',
				role: UserRole.ADMIN,
				accountStatus: AccountStatus.ACTIVE,
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(201);
			const user = (response.body as { user: unknown }).user as {
				role: string;
				accountStatus: string;
			};
			expect(user.role).toBe(UserRole.ADMIN);
			expect(user.accountStatus).toBe(AccountStatus.ACTIVE);
		});
	});

	describe('Validação de Input', () => {
		it('deve retornar 400 para email inválido', async () => {
			const registerData = UserFactory.createRegisterData({
				email: 'invalid-email',
				password: 'password123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('deve retornar 400 para senha muito curta', async () => {
			const registerData = UserFactory.createRegisterData({
				email: 'user@example.com',
				password: 'short',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('deve retornar 400 para nome muito curto', async () => {
			const registerData = UserFactory.createRegisterData({
				name: 'A',
				email: 'user@example.com',
				password: 'password123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('deve retornar 400 para body vazio', async () => {
			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: {},
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('error');
		});
	});

	describe('Edge Cases', () => {
		it('deve retornar 400 para email duplicado', async () => {
			const email = 'duplicate@example.com';
			const existingUser = UserFactory.create({ email });
			await userRepository.create(existingUser);

			const registerData = UserFactory.createRegisterData({
				email,
				password: 'password123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toHaveProperty('error');
		});

		it('deve hash a senha antes de armazenar', async () => {
			const registerData = UserFactory.createRegisterData({
				email: 'hashed@example.com',
				password: 'plainPassword123',
			});

			const response = await makeRequest(server, {
				method: 'POST',
				url: '/auth/register',
				body: registerData,
			});

			expect(response.statusCode).toBe(201);
			const user = (response.body as { user: { id: string } }).user;
			const storedUser = await userRepository.findById(user.id);

			expect(storedUser).not.toBeNull();
			expect(storedUser?.passwordHash).not.toBe('plainPassword123');
			// Bcrypt pode gerar hashes com prefixo $2a$ ou $2b$ dependendo da versão
			expect(storedUser?.passwordHash).toMatch(/^\$2[ab]\$/);
		});
	});
});
