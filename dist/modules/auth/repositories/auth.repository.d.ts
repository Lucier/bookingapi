import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dbSchema from '../../../database/schema/index';
import { users, refreshTokens } from '../../../database/schema/index';
type DrizzleDB = PostgresJsDatabase<typeof dbSchema>;
export declare class AuthRepository {
    private readonly db;
    constructor(db: DrizzleDB);
    findUserByEmail(email: string): Promise<typeof users.$inferSelect | undefined>;
    findUserById(id: string): Promise<typeof users.$inferSelect | undefined>;
    createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
    }): Promise<typeof users.$inferSelect>;
    saveRefreshToken(data: {
        userId: string;
        tokenHash: string;
        expiresAt: Date;
    }): Promise<void>;
    findRefreshToken(tokenHash: string): Promise<typeof refreshTokens.$inferSelect | undefined>;
    deleteRefreshToken(tokenHash: string): Promise<void>;
    deleteUserRefreshTokens(userId: string): Promise<void>;
}
export {};
