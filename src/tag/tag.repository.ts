import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { TagEntity } from "./tag.entity";
import { BaseRepository } from "../base-repository";
import { tagsTable} from "../supabase/migrations/schema";
import { eq, like } from "drizzle-orm";

@provide(TagRepository)
export class TagRepository extends BaseRepository<TagEntity> {
    constructor() {
        super();
        this.table = tagsTable;
    }

    //Checks if a certain tag exists by its name.
    //names are automatically validated by the dto to check if it only contains lowercase letters, no white space, and no special characters.
    async checkByNameLower(name: string): Promise<TagEntity | null> {
        try {

            const res = await this.db
                .select({
                    id: tagsTable.id,
                    name: tagsTable.name,
                })
                .from(tagsTable)
                .where(eq(tagsTable.name, name));
            // console.log("res from checkByNameLower: ", res)
            return res[0];
        } catch (error) {
            console.log("error occured while checking by name_lower: ");
            console.log(error);
            return null;
        }
    }

    //Searches for all names like the one supplied in the request body.
    //names are automatically validated by the dto to check if it only contains lowercase letters, no white space, and no special characters.
    async searchByNameLower(name: string): Promise<TagEntity[] | null> {
        try {

            const res = await this.db
                .select({
                    id: tagsTable.id,
                    name: tagsTable.name,
                })
                .from(tagsTable)
                .where(like(tagsTable.name, `%${name}%`));
            // console.log("res from checkByNameLower: ", res)
            return res;
        } catch (error) {
            console.log("error occured while searching by name lower: ");
            console.log(error);
            return null;
        }
    }
}