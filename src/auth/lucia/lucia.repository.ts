// import { Lucia } from "lucia";
import { provide } from "inversify-binding-decorators";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { BaseRepository } from "../../base-repository";
import { lucia, LuciaProvider } from "./lucia.provider";
// import { Lucia, generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { User } from "../../user/user.entity";
import { IAuthSignupRequestDto, IAuthSignupResponseDto } from "./signup/auth-signup.dto"


@provide(LuciaRepository)
export class LuciaRepository extends BaseRepository<User>{//todo User entity as placeholder for now
	// protected luciaProvider: LuciaProvider;
	// protected lucia: Lucia<Record<never, never>, Record<never, never>>;
	// protected adapter: DrizzlePostgreSQLAdapter;
	protected luciaProvider: LuciaProvider = new LuciaProvider();
	constructor() {
        super();
        this.tableName = userTable;
		// this.lucia = container.get(LuciaProvider).LuciaInstance
		// this.adapter = await this.luciaProvider.getAdapter();
		// this.luciaProvider = new LuciaProvider();
    }
	
	//Signs up a user and creates a session.
	async signUp(request: IAuthSignupRequestDto): Promise<IAuthSignupResponseDto> {
		const email = request.email //Extract email information from request
		// https://lucia-auth.com/guides/email-and-password/basics
		if (!this.luciaProvider.isValid(email, "email")) {
			return {
				status: 400,
				response_message: "Invalid email",
			}
		}
		const password = request.password; //extract password information from request
		if (!this.luciaProvider.isValid(password, "password")) {
			// https://lucia-auth.com/tutorials/username-and-password/nextjs-app
			return {
				status: 400,
				response_message: "Invalid password",
			}
		}
		console.log("Hashing password: ", password)
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		console.log("Hashed password: ", passwordHash)
		let userId: string = "default blah";
		try {
			const { generateIdFromEntropySize } = await import("lucia");
			console.log("Generating user id")
			userId = generateIdFromEntropySize(10); // 16 characters long
			console.log("User id generated: ", userId)
		} catch (e) {
			console.log("Error occured while generating user id")
			console.error(e);
			return {
				status: 500,
				response_message: "Internal server error",
			}
		}
		const username = request.username;
		if (!this.luciaProvider.isValid(username, "username")) {
			//https://lucia-auth.com/tutorials/username-and-password/nextjs-app
			return {
				status: 400,
				response_message: "Invalid username"
			};
		}
	
		try {
			await this.db.insert(userTable).values({
				id: userId,
				email: email,
				username: username,
				password_hash: passwordHash,

			});
			// const session = await lucia.createSession(userId, {});
			// const sessionCookie = lucia.createSessionCookie(session.id);
			return {
				status: 302,
				response_message: "User successfully signed up. ",
				// serializedSessionCookie: sessionCookie.serialize(),
			}
		} catch {
			return {
				status: 400,
				response_message: "Email already used",
			}
		}
		// // Placeholder return for debugging purposes
		//return {
		// 	status: 200,
		// 	response_message: "placeholder for debugging purposes can be commented out in prod default message",
		// }
	}
}