import { z } from 'zod';
import { UserRole } from '../entities/user';

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2),
	email: z.string().email(),
	passwordHash: z.string().min(1),
	role: z.nativeEnum(UserRole),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type UserSchema = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
	.omit({ id: true, createdAt: true, updatedAt: true, passwordHash: true })
	.extend({
		password: z.string().min(8),
	});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
