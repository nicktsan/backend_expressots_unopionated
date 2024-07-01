import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import {DeckSlotEntity} from "./deckslot.entity"
import { BaseRepository } from "../base-repository";
import { cards, deckTable, deckslotTable } from "../supabase/migrations/schema";
import { IDeckslotCreateRequestDto, IDeckslotCreateResponseDto } from "./create/deckslot-create.dto";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { IDeckslotUpdateQuantityRequestDto, IDeckslotUpdateQuantityResponseDto } from "./update/quantity/deckslot-update-quantity.dto";
import { IDeckslotFindRequestDto, IDeckslotFindResponseDto } from "./find/deckslot-find.dto";
import { IDeckslotFindByDeckIdResponseDto } from "./find/bydeckid/deckslot-find-bydeckid.dto";
import { IDeckslotDeleteRequestDto, IDeckslotDeleteResponseDto } from "./delete/deckslot-delete.dto";

@provide(DeckSlotRepository)
export class DeckSlotRepository extends BaseRepository<DeckSlotEntity>{
    constructor() {
        super();
        this.table = deckslotTable;
    }

    //Find all deckslots and its card data by its deckslot.deck_id. If the request is made by an authorized user,
    //they may see deckslots belonging to private decks that belong to the authorized user.
    //If the user is not signed in, then they can only see public and unlisted deckslots.
    async findByDeckId(deckId: string, userId: string): Promise<IDeckslotFindByDeckIdResponseDto | null> {
        // id: integer("id").primaryKey().notNull(),
        // name_kr: text("name_kr"),
        // name_eng: text("name_eng"),
        // code: text("code").notNull(),
        // rarity: text("rarity"),
        // rarity_abb: text("rarity_abb"),
        // card_type: text("card_type"),
        // color: text("color"),
        // color_sub: text("color_sub"),
        // card_level: smallint("card_level"),
        // plain_text_eng: text("plain_text_eng"),
        // plain_text: text("plain_text"),
        // expansion: text("expansion"),
        // illustrator: text("illustrator"),
        // link: text("link"),
        // image_link: text("image_link"),
        try {
            const query = this.db.select({
                deck_id: deckslotTable.deck_id,
                card_id: deckslotTable.card_id,
                board: deckslotTable.board,
                quantity: deckslotTable.quantity,
                name_eng: cards.name_eng,
                code: cards.code,
                rarity: cards.rarity,
                card_type: cards.card_type,
                color: cards.color,
                card_level: cards.card_level,
                plain_text_eng: cards.plain_text_eng,
                expansion: cards.expansion,
                illustrator: cards.illustrator,
                image_link: cards.image_link
            }).from(deckslotTable)
            .innerJoin(cards, eq(deckslotTable.card_id, cards.id))
            .innerJoin(deckTable, eq(deckslotTable.deck_id, deckTable.id));

            let finalQuery;
            //Requests with userIds are made by authorized users. Therefore, they should be able to find any deck
            //they created
            if (userId) {
                // .where(
                //     eq(deckslotTable.deck_id, deckId)
                // )
                finalQuery = query.where(
                    and(
                        //we are inner joining on deckTable.id = deckslotTable.deck_id, so looking for
                        //deckTable.id = deckId is the same as deckslotTable.deck_id = deck_id.
                        eq(deckTable.id, deckId),
                        or(
                            inArray(deckTable.visibility, ['public', 'unlisted']),
                            eq(deckTable.creator_id, userId ?? "")
                            // and(
                            //     eq(deckTable.visibility, 'private'),
                            //     eq(deckTable.creator_id, userId ?? "")
                            // )
                        )
                    )
                );
            } else {
                //Else, the userId is empty, which means the request is made by a guest. Therefore, they are not allowed
                //to find any decks that have their visibility set to 'private'.
                finalQuery = query.where(
                    and(
                        eq(deckTable.id, deckId),
                        inArray(deckTable.visibility, ['public', 'unlisted'])
                    )
                );
            }
            // const { sql: sqlString, params } = finalQuery.toSQL();
            // console.log('Parameters:', params);
            // console.log('SQL Query:', sqlString);
            const res: IDeckslotFindResponseDto[] = await finalQuery;
            if (res.length > 0) {
                const finalRes: IDeckslotFindByDeckIdResponseDto = {
                    deckslots: res,
                    message: "Deck slots successfully found by deckslot id."
                }
                // console.log("finalRes from findById: ", finalRes)
                return finalRes as IDeckslotFindByDeckIdResponseDto;
            }
            return null
        } catch (error) {
            console.log("error occured while finding deckslots by deck id: ")
            console.log(error)
            return null;
        }
    }

    //Delete a deck slot by its primary composite key of deck_id, card_id, and board.
    async deleteOneDeckSlot(payload: IDeckslotDeleteRequestDto): Promise<IDeckslotDeleteResponseDto | null> {
        try {
            const res = await this.db.delete(deckslotTable).where(
                and(
                    eq(deckslotTable.deck_id, payload.deck_id),
                    eq(deckslotTable.card_id, payload.card_id),
                    eq(deckslotTable.board, payload.board ?? "main")
                )
            ).returning({
                deck_id: deckslotTable.deck_id,
                card_id: deckslotTable.card_id,
                board: deckslotTable.board,
                message: sql`'Deckslot successfully deleted'`
            })
            return res[0] as IDeckslotDeleteResponseDto
        } catch (error) {
            console.log("error occured while deleting deckslot: ")
            console.log(error)
            return null
        }
    }
    //Find one deckslot by its composite primary key (deck_id, card_id, and board
    async findOneDeckSlot(payload: IDeckslotFindRequestDto): Promise<IDeckslotFindResponseDto | null> {
        try {
            const res = await this.db.select(
                {
                    deck_id: deckslotTable.deck_id,
                    card_id: deckslotTable.card_id,
                    board: deckslotTable.board,
                    message: sql`'Deckslot successfully found'`,
                }
            ).from(deckslotTable).where(
                and(
                    eq(deckslotTable.deck_id, payload.deck_id),
                    eq(deckslotTable.card_id, payload.card_id),
                    eq(deckslotTable.board, payload.board ?? "main")
                )
            )
            return res[0] as IDeckslotFindResponseDto
        } catch (error) {
            console.log("error occured while finding deckslot: ")
            console.log(error)
            return null
        }
    }
    //Update the quantity of a deck slot. For example, if changeValue is n, then set quantity as `quantity + n`
    async updateQuantity(payload: IDeckslotUpdateQuantityRequestDto, changeValue: number): Promise<IDeckslotUpdateQuantityResponseDto | null> {
        try {
            const resp = await this.db.update(deckslotTable).set({
                quantity: sql`${deckslotTable.quantity} + ${changeValue}`
            }).where(
                and(
                    eq(deckslotTable.deck_id, payload.deck_id),
                    eq(deckslotTable.card_id, payload.card_id),
                    eq(deckslotTable.board, payload.board ?? "main")
                )
            ).returning({
                deck_id: deckslotTable.deck_id,
                card_id: deckslotTable.card_id,
                board: deckslotTable.board,
                quantity: deckslotTable.quantity,
                message: sql`'deckslot successfully updated'`
            })
            return resp[0] as IDeckslotUpdateQuantityResponseDto
        } catch (error) {
            console.log("error occured while updating quantity: ")
            console.log(error)
            return null
        }
    }
    //Create a deckslot. Deck slots have a composite primary key made of deck_id, card_id, and board.
    async createDeckSlot(payload: IDeckslotCreateRequestDto): Promise<IDeckslotCreateResponseDto | null>{
        // @IsNotEmpty()
        // @IsUUID()
        // deck_id: string;
        // @IsNotEmpty()
        // @IsNumber()
        // card_id: number;
        // @IsOptional()
        // @IsIn(['main', 'maybe'], { message: `board must be "main" or "maybe"` })
        // board?: 'main' | 'maybe' | undefined | null
        try {
            const insertValues = {
                deck_id: payload.deck_id,
                card_id: payload.card_id,
                board: payload.board ?? "main"
            }
            const res = await this.db.insert(deckslotTable).values(insertValues).returning({
                deck_id: deckslotTable.deck_id,
                card_id: deckslotTable.card_id,
                quantity: deckslotTable.quantity,
                board: deckslotTable.board,
                message: sql`'deckslot successfully created'`
            })
            return res[0] as IDeckslotCreateResponseDto;
        } catch (error) {
            console.log("error occured while creating deckslot: ")
            console.log(error)
            return null
        }
    }
}