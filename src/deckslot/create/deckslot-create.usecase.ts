import { provide } from "inversify-binding-decorators";
import { IDeckslotCreateRequestDto, IDeckslotCreateResponseDto } from "./deckslot-create.dto";
import { DeckSlotRepository } from "../deckslot.repository";
import { DeckRepository } from "../../deck/deck.repository"
import { AppError, Report, StatusCode } from "@expressots/core";
import { IDeckslotFindRequestDto, IDeckslotFindResponseDto } from "../find/deckslot-find.dto";
import { IDeckslotUpdateQuantityRequestDto, IDeckslotUpdateQuantityResponseDto } from "../update/quantity/deckslot-update-quantity.dto";

@provide(DeckslotCreateUsecase)
export class DeckslotCreateUsecase {
    constructor(
        private deckSlotRepository: DeckSlotRepository,
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(payload: IDeckslotCreateRequestDto, userId: string): Promise<IDeckslotCreateResponseDto | IDeckslotFindResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null = await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                const error = this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "User is not the creator of the deck.",
                );
                throw error;
            }

            // check if deckslot is already in database.
            const deckSlotExists: IDeckslotFindResponseDto | null = await this.deckSlotRepository.findOneDeckSlot(
                payload as IDeckslotFindRequestDto);
            // If it is already in the database, increment quantity by +1 instead.
            if (deckSlotExists) {
                const updateRequest: IDeckslotUpdateQuantityRequestDto = {
                    deck_id: payload.deck_id,
                    card_id: payload.card_id,
                    board: payload.board ?? "main",
                    changeValue: 1
                }
                const updateRes: IDeckslotUpdateQuantityResponseDto | null = await this.deckSlotRepository
                .updateQuantity(updateRequest)
                if (!updateRes) {
                    const error = this.report.error(
                        "Failed to update quantity.",
                        StatusCode.BadRequest,
                        "Failed to update quantity.",
                    );
                    throw error;
                }
                return updateRes;
            }

            const res: IDeckslotCreateResponseDto | null = await this.deckSlotRepository.createDeckSlot(payload);
            if (!res) {
                const error = this.report.error(
                    "Failed to create deckslot.",
                    StatusCode.BadRequest,
                    "Failed to create deckslot.",
                );
                throw error;
            }
            return res;
        } catch (error: any) {
            console.log("Error occured during deck creation:")
            throw error;
        }
    }
}