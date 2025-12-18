export enum UserRole {
	USER = "ROLE_USER",
	ADMIN = "ROLE_ADMIN",
}

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}
