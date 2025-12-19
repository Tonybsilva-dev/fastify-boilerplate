import type { User } from '../../../../../src/core/domain/entities/user';
import type { UserRepository } from '../../../../../src/core/domain/repositories/user-repository';

export class MockUserRepository implements UserRepository {
	private users: Map<string, User> = new Map();

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) ?? null;
	}

	async findByEmail(email: string): Promise<User | null> {
		for (const user of this.users.values()) {
			if (user.email === email) {
				return user;
			}
		}
		return null;
	}

	async create(
		userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> | User,
	): Promise<User> {
		const now = new Date();
		// Se o usuário já tem ID, createdAt e updatedAt, preserva-os
		const hasId = 'id' in userData && userData.id;
		const hasCreatedAt = 'createdAt' in userData && userData.createdAt;
		const hasUpdatedAt = 'updatedAt' in userData && userData.updatedAt;
		
		const user: User = {
			...userData,
			id: hasId ? userData.id : crypto.randomUUID(),
			createdAt: hasCreatedAt ? userData.createdAt : now,
			updatedAt: hasUpdatedAt ? userData.updatedAt : now,
		};
		this.users.set(user.id, user);
		return user;
	}

	async update(
		id: string,
		userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
	): Promise<User | null> {
		const existing = this.users.get(id);
		if (!existing) {
			return null;
		}

		const updated: User = {
			...existing,
			...userData,
			updatedAt: new Date(),
		};
		this.users.set(id, updated);
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		return this.users.delete(id);
	}

	// Helper methods for testing
	clear(): void {
		this.users.clear();
	}

	getAll(): User[] {
		return Array.from(this.users.values());
	}

	count(): number {
		return this.users.size;
	}
}
