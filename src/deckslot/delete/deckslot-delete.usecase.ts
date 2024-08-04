import { provide } from "inversify-binding-decorators";
import {
    IDeckslotDeleteRequestDto,
    IDeckslotDeleteResponseDto,
} from "./deckslot-delete.dto";
import { DeckSlotRepository } from "../deckslot.repository";
import { DeckRepository } from "../../deck/deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckslotDeleteUsecase)
export class DeckslotDeleteUsecase {
    constructor(
        private deckSlotRepository: DeckSlotRepository,
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckslotDeleteRequestDto,
        userId: string,
    ): Promise<IDeckslotDeleteResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                const error = this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "User is not the creator of the deck.",
                );
                throw error;
            }

            // check if deckslot is already in database.
            // const deckSlotExists: IDeckslotFindResponseDto | null = await this.deckSlotRepository.findOneDeckSlot(
            //     payload as IDeckslotFindRequestDto);
            // // If it is already in the database, delete it
            // if (deckSlotExists) {
            // }

            const res: IDeckslotDeleteResponseDto | null =
                await this.deckSlotRepository.deleteOneDeckSlot(payload);
            if (!res) {
                const error = this.report.error(
                    "Failed to delete deckslot.",
                    StatusCode.BadRequest,
                    "Failed to delete deckslot.",
                );
                throw error;
            }
            return res;
        } catch (error: any) {
            console.log("Error occured during deck deletion:");
            throw error;
        }
    }
}
