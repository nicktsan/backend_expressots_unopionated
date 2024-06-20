import { provideSingleton } from "@expressots/core";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { postgres_pool_config } from "./postgres/postgresDB";

/**
 * Provider to inject the database pool into the container.
 */
let pool: Pool;
let db: NodePgDatabase<Record<string, never>>;

@provideSingleton(DrizzleProvider)
export class DrizzleProvider {

    private initPool(): void {
        if (!pool) {
            pool = new Pool(postgres_pool_config);
            console.log("Pool created");
        }
        else {
            console.log("Pool already exists");
        }
        // console.log(pool)
    }
    
    public get Pool(): Pool {
        this.initPool();
        return pool;
    }

    public get Drizzle(): NodePgDatabase<Record<string, never>> {
        this.initPool();
        if (!db) {
            db = drizzle(pool)
            console.log("Drizzle created");
        }
        else {
            console.log("Drizzle already exists");
        }
        // console.log(db)
        return db
    }

    public get closePool(): boolean {
        try{
            if (pool) {
                pool.end();
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
