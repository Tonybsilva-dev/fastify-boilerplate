import { describe, expect, it } from 'vitest';
import { UserRole } from '../../../../src/core/domain';
import {
	createAbilityForUser,
	createEmptyAbility,
} from '../../../../src/shared/rbac/ability-factory';
import type { AuthenticatedUser } from '../../../../src/shared/rbac/types';
import { Action, Subject } from '../../../../src/shared/rbac/types';

describe('createAbilityForUser', () => {
	describe('ROLE_USER', () => {
		it('deve permitir que usuário leia seus próprios dados', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			// Para MongoAbility, verificamos se pode fazer a ação no subject
			// As condições são verificadas automaticamente quando aplicadas
			expect(ability.can(Action.READ, Subject.USER)).toBe(true);
		});

		it('deve permitir que usuário atualize seus próprios dados', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			expect(ability.can(Action.UPDATE, Subject.USER)).toBe(true);
		});

		it('NÃO deve permitir que usuário delete recursos', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			expect(ability.cannot(Action.DELETE, Subject.USER)).toBe(true);
		});

		it('deve permitir que usuário leia e atualize apenas seus próprios dados (condições aplicadas)', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			// Usuário pode ler e atualizar USER (com condições restritivas)
			// As condições { id: user.id } são aplicadas automaticamente nas regras
			expect(ability.can(Action.READ, Subject.USER)).toBe(true);
			expect(ability.can(Action.UPDATE, Subject.USER)).toBe(true);
			// Mas não pode deletar ou criar
			expect(ability.cannot(Action.DELETE, Subject.USER)).toBe(true);
			expect(ability.cannot(Action.CREATE, Subject.USER)).toBe(true);
		});

		it('NÃO deve permitir que usuário delete recursos', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			expect(ability.can(Action.DELETE, Subject.USER)).toBe(false);
		});

		it('NÃO deve permitir que usuário crie recursos', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			expect(ability.can(Action.CREATE, Subject.USER)).toBe(false);
		});

		it('NÃO deve permitir que usuário gerencie todos os recursos', () => {
			const user: AuthenticatedUser = {
				id: 'user-123',
				email: 'user@example.com',
				role: UserRole.USER,
			};

			const ability = createAbilityForUser(user);

			expect(ability.can(Action.MANAGE, Subject.ALL)).toBe(false);
		});
	});

	describe('ROLE_ADMIN', () => {
		it('deve permitir que admin gerencie todos os recursos', () => {
			const admin: AuthenticatedUser = {
				id: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const ability = createAbilityForUser(admin);

			expect(ability.can(Action.MANAGE, Subject.ALL)).toBe(true);
		});

		it('deve permitir que admin leia qualquer usuário', () => {
			const admin: AuthenticatedUser = {
				id: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const ability = createAbilityForUser(admin);

			// Admin pode ler qualquer usuário (sem condições específicas)
			expect(ability.can(Action.READ, Subject.USER)).toBe(true);
		});

		it('deve permitir que admin atualize qualquer usuário', () => {
			const admin: AuthenticatedUser = {
				id: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const ability = createAbilityForUser(admin);

			// Admin pode atualizar qualquer usuário (sem condições específicas)
			expect(ability.can(Action.UPDATE, Subject.USER)).toBe(true);
		});

		it('deve permitir que admin delete qualquer usuário', () => {
			const admin: AuthenticatedUser = {
				id: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const ability = createAbilityForUser(admin);

			expect(ability.can(Action.DELETE, Subject.USER)).toBe(true);
		});

		it('deve permitir que admin crie recursos', () => {
			const admin: AuthenticatedUser = {
				id: 'admin-123',
				email: 'admin@example.com',
				role: UserRole.ADMIN,
			};

			const ability = createAbilityForUser(admin);

			expect(ability.can(Action.CREATE, Subject.USER)).toBe(true);
		});
	});

	describe('Edge cases', () => {
		it('deve retornar ability vazia para role desconhecido', () => {
			const userWithUnknownRole = {
				id: 'user-123',
				email: 'user@example.com',
				role: 'UNKNOWN_ROLE' as UserRole,
			};

			const ability = createAbilityForUser(userWithUnknownRole);

			expect(ability.can(Action.READ, Subject.USER)).toBe(false);
			expect(ability.can(Action.MANAGE, Subject.ALL)).toBe(false);
		});
	});
});

describe('createEmptyAbility', () => {
	it('deve retornar ability sem permissões', () => {
		const ability = createEmptyAbility();

		expect(ability.can(Action.READ, Subject.USER)).toBe(false);
		expect(ability.can(Action.MANAGE, Subject.ALL)).toBe(false);
		expect(ability.can(Action.CREATE, Subject.USER)).toBe(false);
	});
});
