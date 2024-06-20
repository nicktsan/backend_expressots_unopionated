import { Lucia } from "lucia";
import { provide } from "inversify-binding-decorators";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { DrizzleProvider } from "../../db/drizzle/drizzle.provider";

export let lucia: Lucia<Record<never, never>, Record<never, never>>;
export let adapter: DrizzlePostgreSQLAdapter;
@provide(LuciaProvider)
export class LuciaProvider {
	adapter;
	constructor() {
		adapter = new DrizzlePostgreSQLAdapter(container.get(DrizzleProvider).Drizzle, sessionTable, userTable);
	}
    public get Lucia(): Lucia<Record<never, never>, Record<never, never>> {
		if (!lucia) {
			if (!adapter) {
				adapter = new DrizzlePostgreSQLAdapter(container.get(DrizzleProvider).Drizzle, sessionTable, userTable);
				console.log("Adapter created")
			}
			else {
				console.log("Adapter already exists")
			}
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
						email: attributes.email
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

	public isValidEmail(email: string): boolean {
		return /.+@.+/.test(email);
	}
	
}

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			email: string;
		};
	}
}

