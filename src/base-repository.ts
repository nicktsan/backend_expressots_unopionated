import "reflect-metadata";
import { IEntity } from "./base.entity";
import { DrizzleProvider } from "./db/drizzle/drizzle.provider"
import { container } from "./app.container";
import { provide } from "inversify-binding-decorators";
import { IBaseRepository } from "./base-repository.interface";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { eq, sql } from "drizzle-orm";

@provide(BaseRepository)
export class BaseRepository<T extends IEntity> implements IBaseRepository<T> {
    protected db: NodePgDatabase<Record<string, never>>;
    protected table: PgTableWithColumns<any>; //todo fix this any later cuz its stinky

    constructor() {
        this.db = container.get(DrizzleProvider).Drizzle;
    }

    async create(item: T): Promise<T | null> {
        try {
            const res = await this.db.insert(this.table).values(item).returning({ id: this.table.id })
            return res[0] as T;
        } catch (error) {
            console.log("error occured while creating: ")
            console.log(error)
            return null
        }
    }

    // async delete(id: string): Promise<boolean> {
    //     try {
    //         const res = await this.db.delete(this.table).where(
    //             eq(this.table.id, id)).returning({ deletedId: this.table.id })
    //         return res.length > 0
    //     } catch (error) {
    //         console.log("error occured while deleting: ")
    //         console.log(error)
    //         return false
    //     }
    // }

    // async update(item: T): Promise<T | null> {
    //     try {
    //         const fields = Object.keys(item)
    //             .map((key, index) => `${key} = $${index + 1}`)
    //             .join(", ");
    //         const values = Object.values(item);
    //         const res: QueryResult = await client.query(
    //             `UPDATE ${this.table} SET ${fields} WHERE id = $${values.length} RETURNING ${fields}`,
    //             values,
    //         );
    //         return res.rows[0] as T;
    //     } catch {
    //         console.log("error occured while updating: ")
    //         return null;
    //     }
    // }

    async find(id: string): Promise<T | null> {
        try {
            const res = await this.db.select().from(this.table).where(eq(this.table.id, id));
            return res[0] as T;
        } catch {
            console.log("error occured while finding: ")
            return null;
        }
    }

    async findAll(item: T): Promise<T[]> {
        try {
            const fields = Object.keys(item)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(", ");
            // const res = await this.db.select().from(this.table);
            
            const res = await this.db.execute(sql`select ${fields} from ${this.table}`);
            return res as T[];
        }
        catch (error) {
            console.log("error occured while finding all: ")
            console.log(error)
            return []
        }
    }
}