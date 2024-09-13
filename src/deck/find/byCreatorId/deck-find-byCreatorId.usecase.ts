import { provide } from "inversify-binding-decorators";
import {
    IDeckFindRequestByCreatorIdDto,
    IDeckFindResponseByCreatorIdDto,
} from "./deck-find-byCreatorId.dto";
import { DeckRepository } from "../../deck.repository";
import { DeckEntity } from "../../deck.entity";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckFindByCreatorIdUsecase)
export class DeckFindByCreatorIdUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckFindRequestByCreatorIdDto,
        userId: string,
    ): Promise<IDeckFindResponseByCreatorIdDto | AppError> {
        try {
            const res: DeckEntity[] | null =
                await this.deckRepository.findByCreatorId(payload, userId);
            if (!res) {
                throw this.report.error(
                    "User's decks not found",
                    StatusCode.NotFound,
                    "deck-find-mine.usecase",
                );
            }
            if (res.length < 1) {
                throw this.report.error(
                    "User has no public decks",
                    StatusCode.NotFound,
                    "deck-find-mine.usecase",
                );
            }
            return {
                decks: res,
                message: "User's decks found successfully.",
            };
        } catch (error: any) {
            console.log("Error occured while finding user's decks:");
            throw error;
        }
    }
}
