// import { provide } from "inversify-binding-decorators";

// @provide(DeleteUsecase)
// export class DeleteUsecase {}
import { provide } from "inversify-binding-decorators";
import {
    IDeckTagDeleteRequestDto,
    IDeckTagDeleteResponseDto,
} from "./decktag-delete.dto";
import { DeckTagRepository } from "../decktag.repository";
import { DeckRepository } from "../../deck/deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckTagDeleteUsecase)
export class DeckTagDeleteUsecase {
    constructor(
        private deckTagRepository: DeckTagRepository,
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckTagDeleteRequestDto,
        userId: string,
    ): Promise<IDeckTagDeleteResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(payload.deck_id, userId);
            if (!isDeckCreator) {
                throw this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "DeckTagDeleteUsecase",
                );
            }

            const res: boolean = await this.deckTagRepository.delete(
                payload.id,
            );
            if (!res) {
                throw this.report.error(
                    "Failed to delete deck tag.",
                    StatusCode.BadRequest,
                    "DeckTagDeleteUsecase",
                );
            }
            return {
                isDeleted: res,
                message: "Deck tag deleted successfully.",
            };
        } catch (error: any) {
            console.log("Error occured during deck tag deletion:");
            throw error;
        }
    }
}
