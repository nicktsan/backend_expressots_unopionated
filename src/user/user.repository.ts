import { UserEntity } from "./user.entity";
import { BaseRepository } from "../base-repository";
import { provide } from "inversify-binding-decorators";
import { userTable } from "../supabase/migrations/schema";
import { eq, and } from 'drizzle-orm';

@provide(UserRepository)
export class UserRepository extends BaseRepository<UserEntity> {
    constructor() {
        super();
        this.table = userTable;
    }
    async create(item: UserEntity): Promise<UserEntity | null> {
        try {
            const res: UserEntity[] = await this.db.insert(userTable).values(item).returning({
                    id: userTable.id,
                    username: userTable.username,
                    email: userTable.email
                });
            return res[0]
        } catch (error) {
            console.log("error occured while creating user: ")
            console.log(error)
            return null
        }
    }

    async findByEmail(email: string, password_hash: string): Promise<UserEntity | null> {

        try {
            const res = await this.db.select({
                id: userTable.id,
                username: userTable.username,
                email: userTable.email
            }).from(userTable).where(
                and(
                    eq(userTable.email, email)
                )
            );
            console.log("res from findByEmail:")
            console.log(res);
            return res[0] as UserEntity;
        } finally {
            
        }
    }
}