import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { TagEntity } from "./tag.entity";
import { BaseRepository } from "../base-repository";
import { tagsTable} from "../supabase/migrations/schema";
import { eq } from "drizzle-orm";

@provide(TagRepository)
export class TagRepository extends BaseRepository<TagEntity> {
    constructor() {
        super();
        this.table = tagsTable;
    }

    async findByNameLower(name: string): Promise<TagEntity | null> {
        try {
            const res = await this.db
                .select({
                    id: tagsTable.id,
                    name: tagsTable.name,
                })
                .from(tagsTable)
                .where(eq(tagsTable.name, name.toLowerCase()));
            // console.log("res from findByNameLower: ", res)
            return res[0];
        } catch (error) {
            console.log("error occured while finding by name_lower: ");
            console.log(error);
            return null;
        }
    }
}