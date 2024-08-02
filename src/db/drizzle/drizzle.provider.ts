import { provideSingleton } from "@expressots/core";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { postgres_pool_config } from "./postgres/postgresDB";

/**
 * Provider to inject the database pool into the container.
 */
@provideSingleton(DrizzleProvider)
export class DrizzleProvider {
    private pool: Pool | null = null;
    private db: NodePgDatabase<Record<string, never>> | null = null;

    private constructor() { }
    private initPool(): void {
        if (!this.pool) {
            this.pool = new Pool(postgres_pool_config);
            console.log("Pool created");
        }
        else {
            // console.log("Pool already exists");
        }
        // console.log(pool)
    }
    
    public get Pool(): Pool {
        this.initPool();
        return this.pool;
    }

    public get Drizzle(): NodePgDatabase<Record<string, never>> {
        this.initPool();
        if (!this.db) {
            this.db = drizzle(this.pool)
            console.log("Drizzle created");
        }
        else {
            // console.log("Drizzle already exists");
        }
        // console.log(db)
        return this.db
    }

    public get closePool(): boolean {
        try{
            if (this.pool) {
                this.pool.end();
                console.log("Pool closed");
            }
        }
        catch (error) {
            console.log("Error while closing pool");
            console.log(error);
            return false;
        }
        return true;
    }
}
