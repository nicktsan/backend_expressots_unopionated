import "reflect-metadata";
import { provide } from "inversify-binding-decorators";
import {DeckSlotEntity} from "./deckslot.entity"
import { BaseRepository } from "../base-repository";
import { deckslotTable } from "../supabase/migrations/schema";
import { IDeckslotCreateRequestDto, IDeckslotCreateResponseDto } from "./create/deckslot-create.dto";
import { and, eq, sql } from "drizzle-orm";
import { IDeckslotUpdateQuantityRequestDto, IDeckslotUpdateQuantityResponseDto } from "./update/quantity/deckslot-update-quantity.dto";
import { IDeckslotFindRequestDto, IDeckslotFindResponseDto } from "./find/deckslot-find.dto";

@provide(DeckSlotRepository)
export class DeckSlotRepository extends BaseRepository<DeckSlotEntity>{
    constructor() {
        super();
        this.table = deckslotTable;
    }
    
    async findDeckSlot(payload: IDeckslotFindRequestDto): Promise<IDeckslotFindResponseDto | null> {
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