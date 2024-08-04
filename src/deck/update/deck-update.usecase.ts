import { provide } from "inversify-binding-decorators";
import { IDeckUpdateRequestDto, IDeckUpdateResponseDto } from "./deck-update.dto";
import { DeckRepository } from "../../deck/deck.repository"
import { AppError, Report, StatusCode } from "@expressots/core";
import { deckTable } from "../../supabase/migrations/schema";
import { DeckEntity } from "../deck.entity";

@provide(DeckUpdateUsecase)
export class DeckUpdateUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(payload: IDeckUpdateRequestDto, userId: string): Promise<IDeckUpdateResponseDto | AppError> {
        try {
            //First, check if the user making this request is the creator of the deck.
            const isDeckCreator: Record<string, string> | null = await this.deckRepository.checkCreator(payload.id, userId);
            if (!isDeckCreator) {
                const error = this.report.error(
                    "User is not the creator of the deck.",
                    StatusCode.BadRequest,
                    "User is not the creator of the deck.",
                );
                throw error;
            }
            const res: DeckEntity | null = await this.deckRepository.update(payload, true)
            // console.log(res)
            if (!res) {
                const error = this.report.error(
                    "Failed to update deck.",
                    StatusCode.NotFound,
                    "Failed to update deck.",
                );
                throw error;
            }
            return {
                deckEntity: res,
                message: "Deck updated successfully."
            };
        } catch (error: any) {
            console.log("Error occured during deck update:")
            throw error;
        }
    }
}