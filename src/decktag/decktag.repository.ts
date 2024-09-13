import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { DeckTagEntity } from "./decktag.entity";
import { BaseRepository } from "../base-repository";
import { deckTagsTable, tagsTable} from "../supabase/migrations/schema";
import { and, eq } from "drizzle-orm";
import { ITagCreateRequestDto } from "../tag/create/tag-create.dto";

@provide(DeckTagRepository)
export class DeckTagRepository extends BaseRepository<DeckTagEntity> {
    constructor() {
        super();
        this.table = deckTagsTable;
    }

    async checkDeckTagExists(payload: ITagCreateRequestDto): Promise<DeckTagEntity[] | null> {
        try {
            const res = await this.db
                .select({
                    id: deckTagsTable.id,
                    deck_id: deckTagsTable.deck_id,
                    tag_id: deckTagsTable.tag_id
                })
                .from(deckTagsTable)
                .innerJoin(tagsTable, eq(deckTagsTable.tag_id, tagsTable.id))
                .where(
                    and(
                        eq(deckTagsTable.deck_id, payload.deck_id),
                        eq(tagsTable.name, payload.name),
                    ),
                );
            return res;
        } catch (error) {
            console.log("error occured while finding deck tag by deck id: ");
            console.log(error);
            return null;
        }
    }

    async findDeckTagsByDeckId(payload: ITagCreateRequestDto): Promise<DeckTagEntity[] | null> {
        try {
            const res = await this.db
                .select({
                    id: deckTagsTable.id,
                    deck_id: deckTagsTable.deck_id,
                    tag_id: deckTagsTable.tag_id
                })
                .from(deckTagsTable)
                .innerJoin(tagsTable, eq(deckTagsTable.tag_id, tagsTable.id))
                .where(eq(deckTagsTable.deck_id, payload.deck_id));
            return res;
        } catch (error) {
            console.log("error occured while finding deck tag by deck id: ");
            console.log(error);
            return null;
        }
    }
}