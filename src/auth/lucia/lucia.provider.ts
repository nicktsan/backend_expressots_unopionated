import { provide } from "inversify-binding-decorators";
// import { sessionTable, userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { DrizzleProvider } from "../../db/drizzle/drizzle.provider";
import { z } from "zod"
import type { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import type { Lucia } from "lucia";

export let lucia: Lucia<Record<never, never>, Record<never, never>>;
export let adapter: DrizzlePostgreSQLAdapter;
@provide(LuciaProvider)
export class LuciaProvider {
	private async initAdapter(): Promise<void> {
		console.log("Initializing Lucia adapter")
		if (!adapter) {
			const { DrizzlePostgreSQLAdapter } = await import("@lucia-auth/adapter-drizzle");
			// adapter = new DrizzlePostgreSQLAdapter(container.get(DrizzleProvider).Drizzle, sessionTable, userTable);
			// adapter = new DrizzlePostgreSQLAdapter(container.get(DrizzleProvider).Drizzle, sessionTable, userTable);
			console.log("Adapter created")
		}
		else {
			console.log("Adapter already exists")
		}
	}

	public async getAdapter(): Promise<DrizzlePostgreSQLAdapter>{
		await this.initAdapter();
		return adapter;
	}

	// IMPORTANT!
	public async getLuciaInstance(): Promise<Lucia<Record<never, never>, Record<never, never>>> {
		console.log("Getting Lucia instance")
		if (!lucia) {
			await this.initAdapter()
			const { Lucia } = await import("lucia");
			lucia = new Lucia(adapter, {
				sessionCookie: {
					attributes: {
						// set to `true` when using HTTPS
						secure: process.env.NODE_ENV === "production"
					}
				},
				getUserAttributes: (attributes) => {
					return {
						// we don't need to expose the password hash!
						email: attributes.email,
						username: attributes.username
					};
				}
			
			})
			console.log("Lucia created")
		}
		else {
			console.log("Lucia already exists")
		}
		return lucia
	}

	protected validEmailSchema = z.string().email()
	protected validPasswordSchema = z.string().min(8)
	protected validUsernameSchema = z.string().min(3).max(31).regex(/^[a-z0-9_-]+$/)
	public isValid(val: string, schema: string): boolean {
		let schemaToUse: z.ZodString | null = null;
		if (schema === "email") {
			schemaToUse = this.validEmailSchema
		}
		if (schema === "password") {
			schemaToUse = this.validPasswordSchema
		}
		if (schema === "username") {
			schemaToUse = this.validUsernameSchema
		}
		if (!schemaToUse) {
			console.log("Invalid" + schema + "schema")
			return false
		}
		try {
			//check if the value matches any of the username, email, or password schemas
			console.log("Parsing val in isValid:", val)
			const result = schemaToUse!.safeParse(val);
			console.log("Result of parsing val in isValid:", result)
			if (!result.success) {
				// handle error then return
				console.log(result.error)
				return false
			} else {
				// do something
				return true
			}
		} catch (error) {
			console.log("Error caught in isValid while parsing " + val)
			console.log(error)
			return false
		}
	}
}

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	username: string;
}

