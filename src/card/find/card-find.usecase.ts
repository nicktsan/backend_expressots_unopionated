import { provide } from "inversify-binding-decorators";
import { CardRepository } from "../card.repository";
import { ICardFindRequestDto, ICardFindResponseDto } from "./card-find.dto";
import { AppError, Report, StatusCode } from "@expressots/core";
import { CardEntity } from "../card.entity";

@provide(CardFindUsecase)
export class CardFindUsecase {
    constructor(
        private cardRepository: CardRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: ICardFindRequestDto,
    ): Promise<ICardFindResponseDto | AppError> {
        const res: CardEntity[] = await this.cardRepository.customFind(payload);
        if (!res) {
            throw this.report.error(
                "cards not found",
                StatusCode.NotFound,
                "cards not found",
            );
        }
        return {
            cards: res,
            message: "Card successfully found.",
        };
    }
}
