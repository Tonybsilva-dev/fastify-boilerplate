import type { User } from '../entities/user';

export interface UserRepository {
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
	update(
		id: string,
		user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
	): Promise<User | null>;
	delete(id: string): Promise<boolean>;
}
