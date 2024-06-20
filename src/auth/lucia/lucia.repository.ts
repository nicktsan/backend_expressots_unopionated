import { Lucia } from "lucia";
import { provide } from "inversify-binding-decorators";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../../supabase/migrations/schema"
import pg from "pg";
import { container } from "./../../app.container"
import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { DrizzleProvider } from "../../db/drizzle/drizzle.provider";
import { BaseRepository } from "../../base-repository";

@provide(LuciaRepository)
export class LuciaRepository {
	protected pool: Pool;
	protected db: NodePgDatabase<Record<string, never>>;
	protected adapter: DrizzlePostgreSQLAdapter;
	constructor() {
		this.pool = container.get(DrizzleProvider).Pool;
		this.db = drizzle(
			this.pool
		);
		this.adapter = new DrizzlePostgreSQLAdapter(
			this.db,
			sessionTable,
			userTable
		);
	}
}