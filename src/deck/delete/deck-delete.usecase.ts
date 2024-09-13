import { provide } from "inversify-binding-decorators";
import { IDeckDeleteResponseDto } from "./deck-delete.dto";
import { DeckRepository } from "../deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckDeleteUsecase)
export class DeckDeleteUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        id: string,
        userId: string,
    ): Promise<IDeckDeleteResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null =
                await this.deckRepository.checkCreator(id, userId);
            if (!isDeckCreator) {
                throw this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "User is not the creator of the deck.",
                );
            }

            const res: boolean = await this.deckRepository.delete(id);
            if (!res) {
                throw this.report.error(
                    "Failed to delete deck.",
                    StatusCode.BadRequest,
                    "Failed to delete deck.",
                );
            }
            return {
                isDeleted: res,
                message: "Deck deleted successfully.",
            };
        } catch (error: any) {
            console.log("Error occured during deck deletion:");
            throw error;
        }
    }
}
