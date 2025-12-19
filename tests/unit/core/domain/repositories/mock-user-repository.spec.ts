import { beforeEach, describe, expect, it } from 'vitest';
import { AccountStatus, UserRole } from '../../../../../src/core/domain';
import { MockUserRepository } from './mock-user-repository';

describe('MockUserRepository', () => {
	let repository: MockUserRepository;

	beforeEach(() => {
		repository = new MockUserRepository();
	});

	it('should create a user', async () => {
		const userData = {
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		};

		const user = await repository.create(userData);

		expect(user.id).toBeDefined();
		expect(user.name).toBe(userData.name);
		expect(user.email).toBe(userData.email);
		expect(user.accountStatus).toBe(AccountStatus.ACTIVE);
		expect(user.createdAt).toBeInstanceOf(Date);
		expect(user.updatedAt).toBeInstanceOf(Date);
	});

	it('should find user by id', async () => {
		const user = await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		const found = await repository.findById(user.id);

		expect(found).not.toBeNull();
		expect(found?.id).toBe(user.id);
	});

	it('should return null when user not found by id', async () => {
		const found = await repository.findById('non-existent-id');
		expect(found).toBeNull();
	});

	it('should find user by email', async () => {
		const user = await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		const found = await repository.findByEmail(user.email);

		expect(found).not.toBeNull();
		expect(found?.email).toBe(user.email);
	});

	it('should return null when user not found by email', async () => {
		const found = await repository.findByEmail('notfound@example.com');
		expect(found).toBeNull();
	});

	it('should update a user', async () => {
		const user = await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		const updated = await repository.update(user.id, {
			name: 'Jane Doe',
		});

		expect(updated).not.toBeNull();
		expect(updated?.name).toBe('Jane Doe');
		expect(updated?.email).toBe(user.email);
		expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
			user.updatedAt.getTime(),
		);
	});

	it('should return null when updating non-existent user', async () => {
		const updated = await repository.update('non-existent-id', {
			name: 'Jane Doe',
		});

		expect(updated).toBeNull();
	});

	it('should delete a user', async () => {
		const user = await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		const deleted = await repository.delete(user.id);

		expect(deleted).toBe(true);
		const found = await repository.findById(user.id);
		expect(found).toBeNull();
	});

	it('should return false when deleting non-existent user', async () => {
		const deleted = await repository.delete('non-existent-id');
		expect(deleted).toBe(false);
	});

	it('should clear all users', () => {
		repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		repository.clear();

		expect(repository.count()).toBe(0);
	});

	it('should return all users', async () => {
		await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		await repository.create({
			name: 'Jane Doe',
			email: 'jane@example.com',
			passwordHash: 'hashed:password2',
			role: UserRole.ADMIN,
			accountStatus: AccountStatus.ACTIVE,
		});

		const all = repository.getAll();

		expect(all.length).toBe(2);
	});

	it('should count users', async () => {
		expect(repository.count()).toBe(0);

		await repository.create({
			name: 'John Doe',
			email: 'john@example.com',
			passwordHash: 'hashed:password',
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		});

		expect(repository.count()).toBe(1);
	});
});
