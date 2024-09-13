// import { provide } from "inversify-binding-decorators";

// @provide(DeckFindCustomUsecase)
// export class DeckFindCustomUsecase {}
import { provide } from "inversify-binding-decorators";
import {
    IDeckFindCustomRequestDto,
    IDeckFindCustomResponseDto,
} from "./deck-find-custom.dto";
import { DeckRepository } from "../../deck.repository";
import { DeckEntity } from "../../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckFindCustomUsecase)
export class DeckFindCustomUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckFindCustomRequestDto,
    ): Promise<IDeckFindCustomResponseDto | AppError> {
        try {
            const res: DeckEntity[] | null =
                await this.deckRepository.customFind(payload);
            if (!res) {
                throw this.report.error(
                    "Error while finding decks",
                    StatusCode.NotFound,
                    "deck-find-custom.usecase error",
                );
            }
            if (res.length < 1) {
                throw this.report.error(
                    "Decks not found",
                    StatusCode.NotFound,
                    "deck-find-custom.usecase not found",
                );
            }
            return {
                decks: res,
                message: "Decks found successfully.",
            };
        } catch (error: any) {
            console.log("Error occured while finding decks:");
            throw error;
        }
    }
}
