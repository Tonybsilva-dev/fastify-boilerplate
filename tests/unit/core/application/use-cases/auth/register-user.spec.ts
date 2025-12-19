import { describe, expect, it } from 'vitest';
import { AccountStatus, UserRole } from '../../../../../../src/core/domain';
import { MockUserRepository } from '../../../domain/repositories/mock-user-repository';
import { BcryptPasswordHasher } from '../../../../../../src/core/infra/auth/password-hasher';
import { JWTService } from '../../../../../../src/core/infra/auth/jwt-service';
import { RegisterUserUseCase } from '../../../../../../src/core/application/use-cases/auth/register-user';
import { DomainError } from '../../../../../../src/app/http/errors/domain-error';

describe('RegisterUserUseCase', () => {
	const jwtSecret = 'test-secret-key-that-is-at-least-32-characters-long';
	const jwtService = new JWTService(jwtSecret);
	const passwordHasher = new BcryptPasswordHasher();

	it('deve registrar um novo usuário com sucesso', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const input = {
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
		};

		const result = await useCase.execute(input);

		expect(result.user).toBeDefined();
		expect(result.user.id).toBeDefined();
		expect(result.user.name).toBe(input.name);
		expect(result.user.email).toBe(input.email);
		expect(result.user.role).toBe(UserRole.USER); // Padrão
		expect(result.user.accountStatus).toBe(AccountStatus.ACTIVE); // Padrão
		expect(result.token).toBeDefined();
		expect(typeof result.token).toBe('string');
	});

	it('deve usar role USER como padrão quando não fornecido', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const result = await useCase.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
		});

		expect(result.user.role).toBe(UserRole.USER);
	});

	it('deve aceitar role ADMIN quando fornecido', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const result = await useCase.execute({
			name: 'Admin User',
			email: 'admin@example.com',
			password: 'securePassword123',
			role: UserRole.ADMIN,
		});

		expect(result.user.role).toBe(UserRole.ADMIN);
	});

	it('deve usar ACTIVE como accountStatus padrão', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const result = await useCase.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
		});

		expect(result.user.accountStatus).toBe(AccountStatus.ACTIVE);
	});

	it('deve aceitar accountStatus customizado', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const result = await useCase.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
			accountStatus: AccountStatus.PENDING_VERIFICATION,
		});

		expect(result.user.accountStatus).toBe(AccountStatus.PENDING_VERIFICATION);
	});

	it('deve lançar erro quando email já existe', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		await repository.create({
			name: 'Existing User',
			email: 'existing@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		await expect(
			useCase.execute({
				name: 'New User',
				email: 'existing@example.com',
				password: 'securePassword123',
			}),
		).rejects.toThrow(DomainError);
	});

	it('deve hash a senha antes de salvar', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const input = {
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
		};

		await useCase.execute(input);

		const user = await repository.findByEmail(input.email);
		expect(user).not.toBeNull();
		expect(user?.passwordHash).not.toBe(input.password);
		expect(user?.passwordHash).toMatch(/^\$2[aby]\$/); // Formato bcrypt
	});

	it('deve gerar token JWT válido', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		const result = await useCase.execute({
			name: 'John Doe',
			email: 'john@example.com',
			password: 'securePassword123',
		});

		const validation = jwtService.validate(result.token);
		expect(validation.valid).toBe(true);
		expect(validation.payload?.userId).toBe(result.user.id);
		expect(validation.payload?.email).toBe(result.user.email);
		expect(validation.payload?.role).toBe(result.user.role);
	});

	it('deve rejeitar senha muito curta', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		await expect(
			useCase.execute({
				name: 'John Doe',
				email: 'john@example.com',
				password: 'short',
			}),
		).rejects.toThrow();
	});

	it('deve rejeitar email inválido', async () => {
		const repository = new MockUserRepository();
		const useCase = new RegisterUserUseCase(
			repository,
			passwordHasher,
			jwtService,
		);

		await expect(
			useCase.execute({
				name: 'John Doe',
				email: 'invalid-email',
				password: 'securePassword123',
			}),
		).rejects.toThrow();
	});
});
