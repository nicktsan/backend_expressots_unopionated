import { provide } from "inversify-binding-decorators";
import { DeckSlotRepository } from "../../deckslot.repository";
import {
    IDeckslotFindByDeckIdRequestDto,
    IDeckslotFindByDeckIdResponseDto,
} from "./deckslot-find-bydeckid.dto";
import { AppError, Report, StatusCode } from "@expressots/core";

@provide(DeckslotFindBydeckidUsecase)
export class DeckslotFindBydeckidUsecase {
    constructor(
        private deckSlotrepository: DeckSlotRepository,
        private report: Report,
    ) {}
    public async execute(
        payload: IDeckslotFindByDeckIdRequestDto,
        userId: string,
    ): Promise<IDeckslotFindByDeckIdResponseDto | AppError> {
        const res: IDeckslotFindByDeckIdResponseDto | null =
            await this.deckSlotrepository.findByDeckId(payload.deck_id, userId);
        if (!res) {
            throw this.report.error(
                "deck slots not found by id",
                StatusCode.NotFound,
                "deck slots not found by id",
            );
        }

        // console.log("res in deck-find.usecase(execute): ")
        // console.log(res)
        return res;
    }
}
