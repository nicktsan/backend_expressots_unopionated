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
            throw this.report.error(
                `Deck ${payload.id} not found`,
                StatusCode.NotFound,
                `DeckUpdateIncrementviewUsecase`,
            );
            // throw error;
        }
        if (
            doesDeckExist.creator_id !== userId &&
            doesDeckExist.visibility.toLowerCase() === "private"
        ) {
            throw this.report.error(
                `User is not authorized to access deck ${payload.id}`,
                StatusCode.BadRequest,
                `DeckUpdateIncrementviewUsecase`,
            );
        }
        const res: DeckEntity | null =
            await this.deckRepository.incrementDeckView(payload.id);
        // console.log("res in DeckUpdateIncrementviewUsecase(execute): ")
        // console.log(res)

        if (!res) {
            throw this.report.error(
                "Deck views failed to increment",
                StatusCode.InternalServerError,
                `DeckUpdateIncrementviewUsecase`,
            );
        }
        return {
            id: res.id,
            message: "Deck updated successfully.",
        };
    }
}
