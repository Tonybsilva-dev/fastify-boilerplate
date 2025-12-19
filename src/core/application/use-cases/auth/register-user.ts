import { DomainError } from '../../../../app/http/errors/domain-error';
import { AccountStatus, UserRole } from '../../../domain/entities/user';
import type { UserRepository } from '../../../domain/repositories/user-repository';
import { createUserSchema } from '../../../domain/schemas/user.schema';
import type { PasswordHasher } from '../../../domain/value-objects/password';
import { Password } from '../../../domain/value-objects/password';
import type { JWTService } from '../../../infra/auth/jwt-service';

/**
 * DTO de entrada para registro de usuário
 */
export interface RegisterUserInput {
	name: string;
	email: string;
	password: string;
	role?: UserRole;
	accountStatus?: AccountStatus;
}

/**
 * DTO de saída para registro de usuário
 */
export interface RegisterUserOutput {
	user: {
		id: string;
		name: string;
		email: string;
		role: UserRole;
		accountStatus: AccountStatus;
		createdAt: Date;
		updatedAt: Date;
	};
	token: string;
}

/**
 * Caso de uso: Registrar novo usuário
 * Valida dados, cria usuário com senha hasheada e retorna token JWT
 */
export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordHasher: PasswordHasher,
		private readonly jwtService: JWTService,
	) {}

	async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
		// Valida dados de entrada com Zod
		const validatedData = createUserSchema.parse({
			name: input.name,
			email: input.email,
			password: input.password,
			role: input.role || UserRole.USER,
			accountStatus: input.accountStatus || AccountStatus.ACTIVE,
		});

		// Verifica se email já existe
		const existingUser = await this.userRepository.findByEmail(
			validatedData.email,
		);
		if (existingUser) {
			throw new DomainError('Email já está em uso', {
				details: { email: validatedData.email },
			});
		}

		// Cria senha hasheada
		const password = await Password.fromPlain(
			validatedData.password,
			this.passwordHasher,
		);

		// Cria usuário
		const user = await this.userRepository.create({
			name: validatedData.name,
			email: validatedData.email,
			passwordHash: password.hash,
			role: validatedData.role,
			accountStatus: validatedData.accountStatus || AccountStatus.ACTIVE,
		});

		// Gera token JWT
		const token = this.jwtService.generate({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				accountStatus: user.accountStatus,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			token,
		};
	}
}
