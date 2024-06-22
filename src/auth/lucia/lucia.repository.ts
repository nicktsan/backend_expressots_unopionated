import { Lucia } from "lucia";
import { provide } from "inversify-binding-decorators";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { BaseRepository } from "../../base-repository";
import { lucia, LuciaProvider } from "./lucia.provider";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { User } from "../../user/user.entity";
import { IAuthSignupRequestDto, IAuthSignupResponseDto } from "../signup/auth-signup.dto"

@provide(LuciaRepository)
export class LuciaRepository extends BaseRepository<User>{//todo User entity as placeholder for now
	protected luciaProvider: LuciaProvider;
	protected lucia: Lucia<Record<never, never>, Record<never, never>>;
	protected adapter: DrizzlePostgreSQLAdapter;
	constructor() {
        super();
        this.tableName = userTable;
		this.lucia = container.get(LuciaProvider).LuciaInstance
		this.adapter = container.get(LuciaProvider).Adapter
    }
	
	//Signs up a user and creates a session.
	async signUp(request: IAuthSignupRequestDto): Promise<IAuthSignupResponseDto> {
		const email = request.email //Extract email information from request
		// https://lucia-auth.com/guides/email-and-password/basics
		if (!this.luciaProvider.isValid(email, "email")) {
			// return new Response("Invalid email", {
			// 	status: 400
			// });
			return {
				status: 400,
				response_message: "Invalid email",
			}
		}
		const password = request.password; //extract password information from request
		if (!this.luciaProvider.isValid(password, "password")) {
			// https://lucia-auth.com/tutorials/username-and-password/nextjs-app
			// return new Response("Invalid password", {
			// 	status: 400
			// });
			return {
				status: 400,
				response_message: "Invalid password",
			}
		}

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		const userId = generateIdFromEntropySize(10); // 16 characters long
		const username = request.username;
		if (!this.luciaProvider.isValid(username, "username")) {
			//https://lucia-auth.com/tutorials/username-and-password/nextjs-app
			return {
				status: 400,
				response_message: "Invalid username"
			};
		}
	
		try {
			// await db.table("user").insert({
			// 	id: userId,
			// 	email,
			// 	password_hash: passwordHash
			// });
			await this.db.insert(userTable).values({
				id: userId,
				email: email,
				username: username,
				password_hash: passwordHash,

			});
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			// return new Response(null, {
			// 	status: 302,
			// 	headers: {
			// 		Location: "/",
			// 		"Set-Cookie": sessionCookie.serialize()
			// 	}
			// });
			return {
				status: 302,
				response_message: "User successfully signed up. ",
				serializedSessionCookie: sessionCookie.serialize(),
			}
		} catch {
			// db error, email taken, etc
			// return new Response("Email already used", {
			// 	status: 400
			// });
			return {
				status: 400,
				response_message: "Email already used",
			}
		}
	}
}