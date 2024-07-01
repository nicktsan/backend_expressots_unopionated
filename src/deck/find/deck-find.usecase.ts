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
    public async execute(payload: IDeckFindRequestDto, userId: string): Promise<IDeckFindResponseDto | AppError> {
        const res: IDeckFindResponseDto | null = await this.deckRepository.findById(payload.id, userId);
        if (!res) {
            const error = this.report.error(
                "This deck not found",
                StatusCode.NotFound,
                "deck-find.usecase",
            );
            throw error;
        }
        // console.log("res in deck-find.usecase(execute): ")
        // console.log(res)
        return res
    }
}
