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
    protected table: PgTableWithColumns<any>;

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

    async delete(id: string): Promise<boolean> {
        try {
            const res = await this.db.delete(this.table).where(
                eq(this.table.id, id)).returning({ deletedId: this.table.id })
            return res.length > 0
        } catch (error) {
            console.log("error occured while deleting: ")
            console.log(error)
            return false
        }
    }

    //Example of how to call this method:
    // const updatePostResult = await dynamicUpdate(
    //     userTable,
    //     { title: 'New Title', content: 'Updated content' },
    //     { id: 1, authorId: 5 }
    // );
    async update(item: T, hasUpdateAt: boolean): Promise<T | null> {
        try {
            const { id, ...itemWithoutId } = item

            // Start building the query
            const queryParts: string[] = [];
            // Dynamically add each field to the query
            for (const [key, value] of Object.entries(itemWithoutId)) {
                if (value !== undefined && key !== 'id') {
                    queryParts.push(`${key} = '${value}'`);
                }
            }
            //We can't explicitly check if the table has the updated_at column, so we rely on the function argument 'hasUpdateAt' instead.
            if (hasUpdateAt) {
                queryParts.push(`updated_at = NOW()`);
            }
            // console.log(queryParts)

            // Combine all updates
            const setClause = queryParts.join(', ');

            // Build the full query
            const query = sql`
                UPDATE ${this.table}
                SET ${sql.raw(setClause)}
                WHERE id = ${id}
                RETURNING *
            `;
            const finalQuery = this.db.execute(query)
            // console.log(finalQuery)
            const res = await finalQuery
            return res.rows[0] as T;
        } catch (error) {
            console.log("error occured while updating: ")
            console.log(error)
            return null
        }
    }

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