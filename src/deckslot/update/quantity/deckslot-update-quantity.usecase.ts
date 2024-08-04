import { provide } from "inversify-binding-decorators";
import {
    IDeckslotUpdateQuantityRequestDto,
    IDeckslotUpdateQuantityResponseDto,
} from "./deckslot-update-quantity.dto";
import { DeckSlotRepository } from "../../deckslot.repository";
import { DeckRepository } from "../../../deck/deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";
import {
    IDeckslotDeleteRequestDto,
    IDeckslotDeleteResponseDto,
} from "../../delete/deckslot-delete.dto";

@provide(DeckslotUpdateQuantityUsecase)
export class DeckslotUpdateQuantityUsecase {
    constructor(
        private deckSlotRepository: DeckSlotRepository,
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckslotUpdateQuantityRequestDto,
        userId: string,
    ): Promise<IDeckslotUpdateQuantityResponseDto | AppError> {
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

            const res: IDeckslotUpdateQuantityResponseDto | null =
                await this.deckSlotRepository.updateQuantity(payload);
            if (!res) {
                const error = this.report.error(
                    "Failed to update deckslot quantity.",
                    StatusCode.NotFound,
                    "Failed to update deckslot quantity.",
                );
                throw error;
            }

            //check if quantity is less than 1. If it is, delete the record.
            if (res.quantity < 1) {
                const deletePayload: IDeckslotDeleteRequestDto = {
                    deck_id: res.deck_id,
                    card_id: res.card_id,
                    board: res.board,
                };
                const deleteRes: IDeckslotDeleteResponseDto | null =
                    await this.deckSlotRepository.deleteOneDeckSlot(
                        deletePayload,
                    );
                if (!deleteRes) {
                    const error = this.report.error(
                        "Failed to delete deckslot.",
                        StatusCode.BadRequest,
                        "Failed to delete deckslot.",
                    );
                    throw error;
                }
                res.message =
                    "Deckslot deleted due to quantity falling below 1.";
            }
            return res;
        } catch (error: any) {
            console.log("Error occured during deckslot quantity update:");
            throw error;
        }
    }
}
