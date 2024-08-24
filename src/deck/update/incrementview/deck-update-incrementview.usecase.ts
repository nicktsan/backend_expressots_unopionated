import { provide } from "inversify-binding-decorators";
import { DeckRepository } from "../../deck.repository";
import { AppError, Report, StatusCode } from "@expressots/core";
import {
    IDeckUpdateIncrementviewRequestDto,
    IDeckUpdateIncrementviewResponseDto,
} from "./deck-update-incrementview.dto";
import { DeckEntity } from "../../deck.entity";
import { ISimpleDeckFindResponseDto } from "../../find/deck-find.dto";

@provide(DeckUpdateIncrementviewUsecase)
export class DeckUpdateIncrementviewUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckUpdateIncrementviewRequestDto,
        userId: string,
    ): Promise<IDeckUpdateIncrementviewResponseDto | AppError> {
        const doesDeckExist: ISimpleDeckFindResponseDto | null =
            await this.deckRepository.simpleFindById(payload.id);
        if (!doesDeckExist) {
            const error = this.report.error(
                `Deck ${payload.id} not found`,
                StatusCode.NotFound,
                `Deck ${payload.id} not found`,
            );
            throw error;
        }
        if (
            doesDeckExist.creator_id !== userId &&
            doesDeckExist.visibility.toLowerCase() === "private"
        ) {
            const error = this.report.error(
                `User is not authorized to access deck ${payload.id}`,
                StatusCode.BadRequest,
                `User is not authorized to access deck ${payload.id}`,
            );
            throw error;
        }
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
