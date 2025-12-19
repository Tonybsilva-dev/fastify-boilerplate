import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserRole } from '../../core/domain';
import {
	Action,
	type AppAbility,
	type AuthenticatedUser,
	type DefineRulesFor,
	Subject,
} from './types';

/**
 * Define regras de permissão para usuários com ROLE_USER
 * Usuários comuns têm permissões limitadas
 */
function defineRulesForUser(
	user: AuthenticatedUser,
	{ can }: AbilityBuilder<AppAbility>,
) {
	// Usuários podem ler e atualizar seus próprios dados
	// Usando condições para restringir acesso apenas aos próprios recursos
	// biome-ignore lint/suspicious/noExplicitAny: CASL MongoAbility requer type assertion para condições
	can(Action.READ, Subject.USER, { id: user.id } as any);
	// biome-ignore lint/suspicious/noExplicitAny: CASL MongoAbility requer type assertion para condições
	can(Action.UPDATE, Subject.USER, { id: user.id } as any);
}

/**
 * Define regras de permissão para usuários com ROLE_ADMIN
 * Administradores têm permissões completas
 */
function defineRulesForAdmin(
	_user: AuthenticatedUser,
	{ can }: AbilityBuilder<AppAbility>,
) {
	// Administradores podem gerenciar tudo
	can(Action.MANAGE, Subject.ALL);
}

/**
 * Mapa de funções de definição de regras por role
 */
const roleRulesMap: Record<UserRole, DefineRulesFor> = {
	[UserRole.USER]: defineRulesForUser,
	[UserRole.ADMIN]: defineRulesForAdmin,
};

/**
 * Factory para criar abilities CASL baseadas no usuário autenticado
 *
 * Compatível com qualquer banco de dados (PostgreSQL, MySQL, etc.)
 * MongoAbility usa sintaxe de query estilo MongoDB, mas funciona com qualquer ORM,
 * incluindo Prisma, TypeORM, Sequelize, etc.
 *
 * @param user - Usuário autenticado com role definido
 * @returns Instância de Ability configurada com as permissões do usuário
 */
export function createAbilityForUser(user: AuthenticatedUser): AppAbility {
	const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

	// Obtém a função de definição de regras para o role do usuário
	const defineRules = roleRulesMap[user.role];

	if (!defineRules) {
		// Se o role não for reconhecido, não concede nenhuma permissão
		return build();
	}

	// Define as regras de permissão para o usuário
	const builder = { can };
	// biome-ignore lint/suspicious/noExplicitAny: CASL AbilityBuilder requer type assertion para cannot
	defineRules(user, builder as any);

	return build();
}

/**
 * Cria uma ability vazia (sem permissões)
 * Útil para usuários não autenticados ou roles desconhecidos
 */
export function createEmptyAbility(): AppAbility {
	const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
	return build();
}
