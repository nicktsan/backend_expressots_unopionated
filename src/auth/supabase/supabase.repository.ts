// import { supabase } from "supabase";
import { provide } from "inversify-binding-decorators";
import { userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { BaseRepository } from "../../base-repository";
import { SupabaseProvider } from "./supabase.provider";
import { User } from "../../user/user.entity";
import { SupabaseClient } from "@supabase/supabase-js";


@provide(SupabaseRepository)
export class SupabaseRepository extends BaseRepository<User>{//todo User entity as placeholder for now
	protected supabase: SupabaseClient;
	constructor(private supabaseProvider: SupabaseProvider) {
        super();
        this.tableName = userTable;
    }

	// Confirms a user's email and performs one time password login.
}