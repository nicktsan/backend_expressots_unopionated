import { User } from "./user.entity";
import { BaseRepository } from "../base-repository";
import { provide } from "inversify-binding-decorators";
import { userTable } from "../supabase/migrations/schema";
import { eq, and } from 'drizzle-orm';

@provide(UserRepository)
export class UserRepository extends BaseRepository<User> {
    constructor() {
        super();
        this.tableName = userTable;
    }

    async findByEmailAndPw(email: string, password_hash: string): Promise<User | null> {

        try {
            const res = await this.db.select({
                id: userTable.id,
                username: userTable.username,
                email: userTable.email
            }).from(userTable).where(
                and(
                    eq(userTable.email, email),
                    eq(userTable.password_hash, password_hash)
                )
            );
            console.log("res from findByEmailAndPw:")
            console.log(res);
            return res[0] as User;
        } finally {
            
        }
    }
}