import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import { DeckTagEntity } from "./decktag.entity";
import { BaseRepository } from "../base-repository";
import { deckTagsTable, tagsTable } from "../supabase/migrations/schema";
import { and, eq } from "drizzle-orm";
import { IDeckTagCreateRequestDto } from "./create/decktag-create.dto";
import { IDecktagEditRequestDto } from "./edit/decktag-edit.dto";

@provide(DeckTagRepository)
export class DeckTagRepository extends BaseRepository<DeckTagEntity> {
    constructor() {
        super();
        this.table = deckTagsTable;
    }

    //Check if a deck tag is associated with a certain deck.
    async checkDeckTagExists(
        payload: IDeckTagCreateRequestDto,
    ): Promise<DeckTagEntity[] | null> {
        try {
            const res = await this.db
                .select({
                    id: deckTagsTable.id,
                    deck_id: deckTagsTable.deck_id,
                    tag_id: deckTagsTable.tag_id,
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
            console.log("error occured while checking if deck tag exists: ");
            console.log(error);
            if (error instanceof Error) {
                throw error;
            }
            return null;
        }
    }

    //Get all deck tags from a deck by deck id.
    async findDeckTagsByDeckId(
        payload: IDeckTagCreateRequestDto,
    ): Promise<DeckTagEntity[] | null> {
        try {
            const res = await this.db
                .select({
                    id: deckTagsTable.id,
                    deck_id: deckTagsTable.deck_id,
                    tag_id: deckTagsTable.tag_id,
                })
                .from(deckTagsTable)
                .innerJoin(tagsTable, eq(deckTagsTable.tag_id, tagsTable.id))
                .where(eq(deckTagsTable.deck_id, payload.deck_id));
            return res;
        } catch (error) {
            console.log("error occured while finding deck tag by deck id: ");
            console.log(error);
            if (error instanceof Error) {
                throw error;
            }
            return null;
        }
    }
}
