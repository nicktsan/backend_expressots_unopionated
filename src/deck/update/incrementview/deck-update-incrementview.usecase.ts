import { provide } from "inversify-binding-decorators";
import { DeckRepository } from "../../deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";
import {
    IDeckUpdateIncrementviewRequestDto,
    IDeckUpdateIncrementviewResponseDto,
} from "./deck-update-incrementview.dto";
import { DeckEntity } from "../../deck.entity";

@provide(DeckUpdateIncrementviewUsecase)
export class DeckUpdateIncrementviewUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckUpdateIncrementviewRequestDto,
    ): Promise<IDeckUpdateIncrementviewResponseDto | AppError> {
        const res: DeckEntity | null =
            await this.deckRepository.incrementDeckView(payload.id);
        // console.log("res in DeckUpdateIncrementviewUsecase(execute): ")
        // console.log(res)

        if (!res) {
            const error = this.report.error(
                "Deck views failed to increment",
                StatusCode.BadRequest,
                "Deck views failed to increment",
            );
            throw error;
        }
        return {
            id: res.id,
            message: "Deck updated successfully.",
        };
    }
}
