import "reflect-metadata";

import { IEntity } from "./base.entity";
import { DrizzleProvider } from "./db/drizzle/drizzle.provider"//"@providers/database/postgres.provider";
import { container } from "./app.container";
import { provide } from "inversify-binding-decorators";
import { Pool, QueryResult } from "pg";
import { IBaseRepository } from "./base-repository.interface";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

@provide(BaseRepository)
export class BaseRepository<T extends IEntity> implements IBaseRepository<T> {
    // protected db!: Pool;
    protected db: NodePgDatabase<Record<string, never>>;
    // protected tableName: string;
    protected tableName: PgTableWithColumns<any>; //todo fix this any later cuz its stinky
    // M extends PgTableWithColumns

    constructor() {
        this.db = container.get(DrizzleProvider).Drizzle;
    }

    // async create(item: T): Promise<T | null> {
    //     // const client = await this.db.connect();

    //     try {
    //         const fields = Object.keys(item).join(", ");
    //         const values = Object.values(item);
    //         const placeholders = values
    //             .map((_, index) => `$${index + 1}`)
    //             .join(", ");
    //         // const res: QueryResult = await client.query(
    //         //     `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders}) RETURNING *`,
    //         //     values,
    //         // );
    //         const res = await this.db.select().from(this.tableName);

    //         return res.rows[0] as T;
    //     } finally {
    //         // client.release();
    //     }
    // }

    // async delete(id: string): Promise<boolean> {
    //     const client = await this.db.connect();

    //     try {
    //         const res: QueryResult = await client.query(
    //             `DELETE FROM ${this.tableName} WHERE id = $1`,
    //             [id],
    //         );
    //         return res.rowCount > 0;
    //     } finally {
    //         client.release();
    //     }
    // }

    // async update(item: T): Promise<T | null> {
    //     const client = await this.db.connect();

    //     try {
    //         const fields = Object.keys(item)
    //             .map((key, index) => `${key} = $${index + 1}`)
    //             .join(", ");
    //         const values = Object.values(item);
    //         const res: QueryResult = await client.query(
    //             `UPDATE ${this.tableName} SET ${fields} WHERE id = $${values.length} RETURNING *`,
    //             values,
    //         );
    //         return res.rows[0] as T;
    //     } finally {
    //         client.release();
    //     }
    // }

    async find(id: string): Promise<T | null> {
        // const client = await this.db.connect();

        try {
            // const res: QueryResult = await client.query(
            //     `SELECT * FROM ${this.tableName} WHERE id = $1`,
            //     [id],
            // );
            const res = await this.db.select().from(this.tableName);
            return res[0] as T;
        } finally {
            // client.release();
        }
    }

    // async findAll(): Promise<T[]> {
    //     const client = await this.db.connect();
    //     console.log(this.tableName);
    //     try {
    //         const res: QueryResult = await client.query(
    //             `SELECT * FROM ${this.tableName}`,
    //         );
    //         return res.rows as T[];
    //     } finally {
    //         client.release();
    //     }
    // }
}