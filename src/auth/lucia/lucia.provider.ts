import { Lucia } from "lucia";
import { provide } from "inversify-binding-decorators";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { DrizzleProvider } from "../../db/drizzle/drizzle.provider";
import { z } from "zod"
// import type { Lucia } from "lucia";

export let lucia: Lucia<Record<never, never>, Record<never, never>>;
export let adapter: DrizzlePostgreSQLAdapter;
@provide(LuciaProvider)
export class LuciaProvider {
	private initAdapter(): void {
		if (!adapter) {
			adapter = new DrizzlePostgreSQLAdapter(container.get(DrizzleProvider).Drizzle, sessionTable, userTable);
			console.log("Adapter created")
		}
		else {
			console.log("Adapter already exists")
		}
	}

	public get Adapter(): DrizzlePostgreSQLAdapter {
		this.initAdapter();
		return adapter;
	}

	// IMPORTANT!
	public get LuciaInstance(): Lucia<Record<never, never>, Record<never, never>> {
		if (!lucia) {
			this.initAdapter()
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
	protected validPasswordSchema = z.string().min(6)
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
			console.log("Invalid schema")
			return false
		}
		try {
			//check if the value matches any of the username, email, or password schemas
			const result = schemaToUse!.safeParse(val);
			if (!result.success) {
				// handle error then return
				console.log(result.error)
				return false
			} else {
				// do something
				return true
			}
		} catch (error) {
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

