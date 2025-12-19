export enum UserRole {
	USER = 'ROLE_USER',
	ADMIN = 'ROLE_ADMIN',
}

export enum AccountStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	SUSPENDED = 'SUSPENDED',
	PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export interface User {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	role: UserRole;
	accountStatus: AccountStatus;
	createdAt: Date;
	updatedAt: Date;
}
