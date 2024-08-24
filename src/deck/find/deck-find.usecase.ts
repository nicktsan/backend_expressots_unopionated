import { provide } from "inversify-binding-decorators";
import { DeckRepository } from "../deck.repository";
import { IDeckFindRequestDto, IDeckFindResponseDto } from "./deck-find.dto";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckFindUsecase)
export class DeckFindUsecase {
    constructor(
        private deckRepository: DeckRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckFindRequestDto,
        userId: string,
    ): Promise<IDeckFindResponseDto | AppError> {
        const res: IDeckFindResponseDto | null =
            await this.deckRepository.findById(payload.id /*, userId*/);
        // console.log("res in deck-find.usecase(execute): ", res)
        if (!res) {
            const error = this.report.error(
                `Deck ${payload.id} not found`,
                StatusCode.NotFound,
                `Deck ${payload.id} not found`,
            );
            throw error;
        }
        if (
            res.creator_id !== userId &&
            res.visibility.toLowerCase() === "private"
        ) {
            const error = this.report.error(
                `User is not authorized to access deck ${payload.id}`,
                StatusCode.BadRequest,
                `User is not authorized to access deck ${payload.id}`,
            );
            throw error;
        }
        return res;
    }
}
