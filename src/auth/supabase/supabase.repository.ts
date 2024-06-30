// import { supabase } from "supabase";
import { provide } from "inversify-binding-decorators";
import { userTable } from "../../supabase/migrations/schema"
import { container } from "./../../app.container"
import { BaseRepository } from "../../base-repository";
import { SupabaseProvider } from "./supabase.provider";
import { UserEntity } from "../../user/user.entity";
import { SupabaseClient } from "@supabase/supabase-js";


@provide(SupabaseRepository)
export class SupabaseRepository extends BaseRepository<UserEntity>{
	protected supabase: SupabaseClient;
	constructor(private supabaseProvider: SupabaseProvider) {
        super();
        this.table = userTable;
    }

	// Confirms a user's email and performs one time password login.
}